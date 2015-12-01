/*
  describe ('API injection', () => {
    it ('should inject implementation', () => {
      var wrapper = {
        wrap: c => c,
        getElectrumApi: () => {
          return {
            getState: (obj, what) => 'getState',
            setState: (obj, ...states) => 'setState',
            getStyle: (obj) => 'getStyle',
            getText:  (obj) => 'getText',
            getValue: (obj) => 'getValue',
            setValue: (obj, value, ...states) => 'setValue'
          };
        }
      };

      E.use (wrapper);
      expect (E.bus).to.deep.equal ({});
      expect (E.getState ()).to.equal ('getState');
      expect (E.setState ()).to.equal ('setState');
      expect (E.getState ()).to.equal ('getState');
      expect (E.setState ()).to.equal ('setState');
      expect (E.getStyle ()).to.equal ('getStyle');
      expect (E.getText  ()).to.equal ('getText');
      expect (E.getValue ()).to.equal ('getValue');
      expect (E.setValue ()).to.equal ('setValue');
    });
  });

  describe ('Bus injection', () => {
    it ('should inject implementation', () => {
      var wrapper = {
        wrap: c => c,
        getElectrumBus: () => {
          return {
            dispatch: (obj, message) => 'dispatch',
            notify: (obj, value, ...states) => 'notify'
          };
        }
      };

      E.use (wrapper);
      expect (E.bus.dispatch ()).to.equal ('dispatch');
      expect (E.bus.notify ()).to.equal ('notify');
    });
  });
*/
