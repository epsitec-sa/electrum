/* global describe it */

import {expect} from 'mai-chai';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import Electrum from 'electrum';

import {Store} from 'electrum-store';
import {Theme} from 'electrum-theme';

let styleGetCounter = 0;

describe ('Component with props', () => {
  const _Test$styles = (theme, props) => {
    styleGetCounter++;
    return {
      base: {
        x: 1,
        font: theme.typo.font
      },
      foo: {
        x: 2,
        y: 2
      },
      bar: {
        y: s => s.x * 20,
        z: props.z
      }
    };
  };

  describe ('injection with Electrum.wrap()', () => {
    const store = Store.create ();
    const theme = Theme.create ('default');
    store.select ('x').set ('text', 'Hello');

    it ('injects styles based on theme', () => {
      class _Test extends React.Component {
        render () {
          const {state} = this.props;
          expect (this.theme).to.exist ();
          expect (this.styles).to.exist ();
          expect (this.styles).to.have.property ('with');
          expect (this.styles).to.have.length (1);
          expect (this.styles[0]).to.have.property ('x', 1);
          expect (this.styles[0]).to.have.property ('font', 'Lato, sans-serif');
          expect (this.mergeStyles ()).to.deep.equal ({});
          expect (this.mergeStyles ('foo')).to.deep.equal ({x: 2, y: 2});
          expect (this.mergeStyles ('foo', 'bar')).to.deep.equal ({x: 2, y: 40, z: 30});
          const styles = this.styles.with ('foo');
          expect (styles).to.have.property ('with');
          expect (styles).to.have.length (1);
          expect (styles[0]).to.have.property ('x', 2);
          expect (styles[0]).to.have.property ('font', 'Lato, sans-serif');
          expect (styles[0]).to.have.property ('y', 2);
          return <div style={styles}>{state.get ('text')}</div>;
        }
        get styleProps () {
          return ({z: 30});
        }
      }
      const Test = Electrum.wrap ('Test', _Test, {styles: _Test$styles});
      const html = ReactDOMServer.renderToStaticMarkup (<Test state={store.select ('x')} theme={theme} />);
      const expectedHtml = '<div style="x:2px;font:Lato, sans-serif;y:2px;" data-radium="true">Hello</div>';
      expect (html).to.equal (expectedHtml);
    });

    describe ('styles', () => {
      let expectedCounter = 1;
      class _Test extends React.Component {
        render () {
          styleGetCounter = 0;
          expect (styleGetCounter).to.equal (0);
          const styles1 = this.styles;
          expect (styleGetCounter).to.equal (1);
          const styles2 = this.styles;
          expect (styleGetCounter).to.equal (2);
          expect (styles1 === styles2).to.be.false ();
          return <div></div>;
        }
        get styleProps () {
          return ({z: 10});
        }
      }
      const Test = Electrum.wrap ('Test', _Test, {styles: _Test$styles});

      it ('does not cache the theme, compiles styles every time', () => {
        ReactDOMServer.renderToStaticMarkup (<Test state={store.select ('x')} theme={theme} />);
      });
    });
  });
});
