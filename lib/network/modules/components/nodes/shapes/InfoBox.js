'use strict';

import NodeBase from '../util/NodeBase'

/**
 * A Box Node/Cluster shape.
 *
 * @extends NodeBase
 */
class InfoBox extends NodeBase {
  /**
   * @param {Object} options
   * @param {Object} body
   * @param {Label} labelModule
   */
  constructor (options, body, labelModule) {
    super(options,body,labelModule);
    this.setMargins(options, labelModule);
  }

  /**
   * @param {Object} options
   * @param {Label} labelModule
   */
  setMargins (options, labelModule) {
    this._setMargins(labelModule);
    var size = 12;
    this.margin.right += size;
    this.margin.left += size;
    this.margin.top += size/2;
    this.margin.bottom += size/2;
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {boolean} [selected]
   * @param {boolean} [hover]
   */
  resize(ctx, selected = this.selected, hover = this.hover) {
    if (this.needsRefresh(selected, hover)) {
      var dimensions = this.getDimensionsFromLabel(ctx, selected, hover);

      this.height = dimensions.height + this.margin.top + this.margin.bottom;
      this.r = 8;
      this.width  = dimensions.width + this.margin.right + this.margin.left + this.r * 3;
      this.radius = this.width / 2;

    }
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x width
   * @param {number} y height
   * @param {boolean} selected
   * @param {boolean} hover
   * @param {{toArrow: boolean, toArrowScale: (allOptions.edges.arrows.to.scaleFactor|{number}|allOptions.edges.arrows.middle.scaleFactor|allOptions.edges.arrows.from.scaleFactor|Array|number), toArrowType: *, middleArrow: boolean, middleArrowScale: (number|allOptions.edges.arrows.middle.scaleFactor|{number}|Array), middleArrowType: (allOptions.edges.arrows.middle.type|{string}|string|*), fromArrow: boolean, fromArrowScale: (allOptions.edges.arrows.to.scaleFactor|{number}|allOptions.edges.arrows.middle.scaleFactor|allOptions.edges.arrows.from.scaleFactor|Array|number), fromArrowType: *, arrowStrikethrough: (*|boolean|allOptions.edges.arrowStrikethrough|{boolean}), color: undefined, inheritsColor: (string|string|string|allOptions.edges.color.inherit|{string, boolean}|Array|*), opacity: *, hidden: *, length: *, shadow: *, shadowColor: *, shadowSize: *, shadowX: *, shadowY: *, dashes: (*|boolean|Array|allOptions.edges.dashes|{boolean, array}), width: *}} values
   */
  draw(ctx, x, y, selected, hover, values) {
    this.resize(ctx, selected, hover);
    this.left = x - this.width / 2;
    this.top = y - this.height / 2;


    var boxOptions = Object.assign(
      {},
      values,
      {
        color: "white",
        borderColor:  selected ? '#97b3c6' : '#cad3d9',
      }
    );
    var circleOptions = Object.assign({}, values, {borderWidth: 2});
    this.initContextForDraw(ctx, boxOptions);
    ctx.roundRect(this.left, this.top, this.width, this.height, values.borderRadius);
    this.performFill(ctx, boxOptions);

    this.initContextForDraw(ctx, circleOptions);
    ctx.circle(this.margin.left + this.left + this.r, this.top + this.margin.top + this.r, this.r)
    this.performFill(ctx, circleOptions);

    this.initContextForDraw(ctx, boxOptions);
    this.updateBoundingBox(x, y, ctx, selected, hover);
    this.labelModule.draw(ctx, this.left + this.textSize.width / 2 + this.margin.left + this.r * 3,
                               this.top + this.textSize.height / 2 + this.margin.top, selected, hover);
  }

  /**
   *
   * @param {number} x width
   * @param {number} y height
   * @param {CanvasRenderingContext2D} ctx
   * @param {boolean} selected
   * @param {boolean} hover
   */
  updateBoundingBox(x, y, ctx, selected, hover) {
    this._updateBoundingBox(x, y, ctx, selected, hover);

    let borderRadius = this.options.shapeProperties.borderRadius; // only effective for box
    this._addBoundingBoxMargin(borderRadius);
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} angle
   * @returns {number}
   */
  distanceToBorder(ctx, angle) {
    this.resize(ctx);
    let borderWidth = this.options.borderWidth;

    return Math.min(
        Math.abs((this.width) / 2 / Math.cos(angle)),
        Math.abs((this.height)  / 2 / Math.sin(angle))) + borderWidth;
  }
}

export default InfoBox;
