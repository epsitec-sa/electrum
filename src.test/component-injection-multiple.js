/* global describe it */

import {expect} from 'mai-chai';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import Electrum from 'electrum';

import {Store} from 'electrum-store';
import {Theme} from 'electrum-theme';

let styleGetCounter = 0;

describe ('Component with multiple styles', () => {
  const _Test$styles1 = theme => {
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
        z: 30
      }
    };
  };
  const _Test$styles2 = () => ({base: {x: 2}});

  describe ('injection with Electrum.wrap()', () => {
    const store = Store.create ();
    const theme = Theme.create ('default');
    store.select ('x').set ('text', 'Hello');

    it ('injects styles based on theme', () => {
      class _Test extends React.Component {
        render () {
          const {state} = this.props;
          expect (this.theme).to.exist ();
          expect (this.getStyles ('style1')).to.exist ();
          expect (this.getStyles ('style1')).to.have.property ('with');
          expect (this.getStyles ('style1')).to.have.length (1);
          expect (this.getStyles ('style1')[0]).to.have.property ('x', 1);
          expect (this.getStyles ('style1')[0]).to.have.property ('font', 'Lato, sans-serif');
          expect (this.getStyles ('style2')[0]).to.have.property ('x', 2);
          expect (this.mergeStyles ('style1')).to.deep.equal ({});
          expect (this.mergeStyles ('style1', 'foo')).to.deep.equal ({x: 2, y: 2});
          expect (this.mergeStyles ('style1', 'foo', 'bar')).to.deep.equal ({x: 2, y: 40, z: 30});
          const styles = this.getStyles ('style1').with ('foo');
          expect (styles).to.have.property ('with');
          expect (styles).to.have.length (1);
          expect (styles[0]).to.have.property ('x', 2);
          expect (styles[0]).to.have.property ('font', 'Lato, sans-serif');
          expect (styles[0]).to.have.property ('y', 2);
          return <div style={styles}>{state.get ('text')}</div>;
        }
      }
      const Test = Electrum.wrap ('Test', _Test, {styles: {style1: _Test$styles1, style2: _Test$styles2}});
      const html = ReactDOMServer.renderToStaticMarkup (<Test state={store.select ('x')} theme={theme} />);
      const expectedHtml = '<div style="x:2px;font:Lato, sans-serif;y:2px;" data-radium="true">Hello</div>';
      expect (html).to.equal (expectedHtml);
    });

    it ('injects styles based on theme, with kind=bar', () => {
      class _Test extends React.Component {
        render () {
          const {state} = this.props;
          expect (this.theme).to.exist ();
          expect (this.getStyles ('style1')).to.exist ();
          expect (this.getStyles ('style1')).to.have.property ('with');
          expect (this.getStyles ('style1')).to.have.length (1);
          expect (this.getStyles ('style1')[0]).to.have.property ('x', 1);
          expect (this.getStyles ('style1')[0]).to.have.property ('font', 'Lato, sans-serif');
          expect (this.getStyles ('style1')[0]).to.have.property ('y', 20);
          expect (this.getStyles ('style1')[0]).to.have.property ('z', 30);
          expect (this.getStyles ('style2')[0]).to.have.property ('x', 2);
          const styles = this.getStyles ('style1').with ('foo');
          expect (styles).to.have.property ('with');
          expect (styles).to.have.length (1);
          expect (styles[0]).to.have.property ('x', 2);
          expect (styles[0]).to.have.property ('font', 'Lato, sans-serif');
          expect (styles[0]).to.have.property ('y', 2);
          expect (styles[0]).to.have.property ('z', 30);
          return <div style={styles}>{state.get ('text')}</div>;
        }
      }
      const Test = Electrum.wrap ('Test', _Test, {styles: {style1: _Test$styles1, style2: _Test$styles2}});
      const html = ReactDOMServer.renderToStaticMarkup (<Test state={store.select ('x')} theme={theme} kind='bar'/>);
      const expectedHtml = '<div style="x:2px;font:Lato, sans-serif;y:2px;z:30px;" data-radium="true">Hello</div>';
      expect (html).to.equal (expectedHtml);
    });

    describe ('styles', () => {
      let expectedCounter = 1;
      class _Test extends React.Component {
        render () {
          styleGetCounter = 0;
          expect (styleGetCounter).to.equal (0);
          const styles1 = this.getStyles ('style1');
          expect (styleGetCounter).to.equal (expectedCounter);
          const styles2 = this.getStyles ('style1');  // no theme to style recompilation
          expect (styleGetCounter).to.equal (expectedCounter);
          expect (styles1 === styles2).to.be.false ();
          return <div></div>;
        }
      }
      const Test = Electrum.wrap ('Test', _Test, {styles: {style1: _Test$styles1, style2: _Test$styles2}});

      it ('caches the theme and compiles styles only once', () => {
        expectedCounter = 1;
        ReactDOMServer.renderToStaticMarkup (<Test state={store.select ('x')} theme={theme} />);
      });

      const theme1 = Theme.create ('default');
      const theme2 = Theme.create ('default');

      it ('invalidates the cache on theme change', () => {
        expectedCounter = 1;
        ReactDOMServer.renderToStaticMarkup (<Test state={store.select ('x')} theme={theme1} />);
      });

      it ('maintains the cache across multiple calls to render()', () => {
        expectedCounter = 1;
        ReactDOMServer.renderToStaticMarkup (<Test state={store.select ('x')} theme={theme2} />);
        expectedCounter = 0;
        ReactDOMServer.renderToStaticMarkup (<Test state={store.select ('x')} theme={theme2} />);
      });
    });
  });
});
