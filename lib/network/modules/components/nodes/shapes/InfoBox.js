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
    var size = options.font.size/2;
    this.margin.top += size;
    this.margin.bottom += size;
    this.margin.right += size;
    this.margin.left += size;
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
      this.r = Math.min(this.height/2 - 6, 15);
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


    var v = Object.assign({}, values, {color: "white", font: {color: "red"}});
    this.initContextForDraw(ctx, v);
    ctx.roundRect(this.left, this.top, this.width, this.height, values.borderRadius);
    this.performFill(ctx, v);

    this.initContextForDraw(ctx, values);
    ctx.circle(this.margin.left + this.left + this.r, y, this.r)
    this.performFill(ctx, values);

    this.initContextForDraw(ctx, v);
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
