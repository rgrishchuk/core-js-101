/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return new proto.constructor(...Object.values(JSON.parse(json)));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  error(value) {
    if (value === 'order') {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    } else if (value === 'elements') {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
  },

  element(value) {
    function MyElementSelector(val, prev) {
      const item = { type: 'element', value: val, weight: 0 };
      if (prev) {
        if (prev.some((elem) => elem.type === 'element')) {
          this.error('elements');
        }
        if (prev[prev.length - 1].weight > item.weight) this.error('order');
        this.items = prev;
      } else {
        this.items = [];
      }
      this.items.push(item);
    }
    MyElementSelector.prototype = cssSelectorBuilder;
    return new MyElementSelector(value, this.items);
  },

  id(value) {
    function MyIdSelector(val, prev) {
      const item = { type: 'id', value: val, weight: 1 };
      if (prev) {
        if (prev.some((elem) => elem.type === 'id')) {
          this.error('elements');
        }
        if (prev[prev.length - 1].weight > item.weight) this.error('order');
        this.items = prev;
      } else {
        this.items = [];
      }
      this.items.push(item);
    }
    MyIdSelector.prototype = cssSelectorBuilder;
    return new MyIdSelector(value, this.items);
  },

  class(value) {
    function MyClassSelector(val, prev) {
      const item = { type: 'class', value: val, weight: 2 };
      if (prev) {
        if (prev[prev.length - 1].weight > item.weight) this.error('order');
        this.items = prev;
      } else {
        this.items = [];
      }
      this.items.push(item);
    }
    MyClassSelector.prototype = cssSelectorBuilder;
    return new MyClassSelector(value, this.items);
  },

  attr(value) {
    function MyAttrSelector(val, prev) {
      const item = { type: 'attr', value: val, weight: 3 };
      if (prev) {
        if (prev[prev.length - 1].weight > item.weight) this.error('order');
        this.items = prev;
      } else {
        this.items = [];
      }
      this.items.push(item);
    }
    MyAttrSelector.prototype = cssSelectorBuilder;
    return new MyAttrSelector(value, this.items);
  },

  pseudoClass(value) {
    function MyPseudoClassSelector(val, prev) {
      const item = { type: 'pseudoClass', value: val, weight: 4 };
      if (prev) {
        if (prev[prev.length - 1].weight > item.weight) this.error('order');
        this.items = prev;
      } else {
        this.items = [];
      }
      this.items.push(item);
    }
    MyPseudoClassSelector.prototype = cssSelectorBuilder;
    return new MyPseudoClassSelector(value, this.items);
  },

  pseudoElement(value) {
    function MyPseudoElementSelector(val, prev) {
      const item = { type: 'pseudoElement', value: val, weight: 5 };
      if (prev) {
        if (prev.some((elem) => elem.type === 'pseudoElement')) {
          this.error('elements');
        }
        if (prev[prev.length - 1].weight > item.weight) this.error('order');
        this.items = prev;
      } else {
        this.items = [];
      }
      this.items.push(item);
    }
    MyPseudoElementSelector.prototype = cssSelectorBuilder;
    return new MyPseudoElementSelector(value, this.items);
  },

  combine(selector1, combinator, selector2) {
    function MyCombineSelector(sel1, comb, sel2) {
      this.items = [].concat(sel1.items);
      this.items.push({ type: 'combine', value: comb });
      this.items = this.items.concat(sel2.items);
    }
    MyCombineSelector.prototype = cssSelectorBuilder;
    return new MyCombineSelector(selector1, combinator, selector2);
  },

  stringify() {
    return this.items.reduce((res, item) => {
      let newRes = res;
      if (item.type === 'element') newRes += item.value;
      if (item.type === 'id') newRes += `#${item.value}`;
      if (item.type === 'class') newRes += `.${item.value}`;
      if (item.type === 'attr') newRes += `[${item.value}]`;
      if (item.type === 'pseudoClass') newRes += `:${item.value}`;
      if (item.type === 'pseudoElement') newRes += `::${item.value}`;
      if (item.type === 'combine') newRes += ` ${item.value} `;
      return newRes;
    }, '');
  },

};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
