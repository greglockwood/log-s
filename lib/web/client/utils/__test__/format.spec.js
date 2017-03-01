import * as format from '../format';

describe('utils/format', () => {
  describe('object', () => {
    it('should stringify object without quoted keys', () => {
      expect(format.object({ a: 1 })).toEqual('{a: 1}');
    });


    it('hould stringify arrays', () => {
      expect(format.object([1, 'Two'])).toEqual('[1, "Two"]');
    });

    it('should stringify complex obhects', () => {
      const obj = {
        a: 'String',
        b: { c: false },
        d: [0, 'one', { two: 2}],
      };
      const result = '{a: "String", b: {c: false}, d: [0, "one", {two: 2}]}';
      expect(format.object(obj)).toEqual(result);
    });
    
    it('should stringify null', () => {
      expect(format.object(null)).toEqual('null');
    });
    
    it('should stringify undefined', () => {
      expect(format.object(undefined)).toEqual(undefined);
    });
    
    it('should stringify true', () => {
      expect(format.object(true)).toEqual('true');
    });
    
    it('should stringify data', () => {
      expect(format.object(new Date())).toMatch(/Z"$/);
    });
  });
});
