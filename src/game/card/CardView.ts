/**
 * Created by Administrator on 2016/10/21.
 */
class CardView extends egret.DisplayObjectContainer {


    static pool: CardView[] = [];

    /*  dir 方位 1 2 3 4 自己开始逆时针
     style 样式 1正面 2背面 3躺
     */
    static create(dir: number, style: number, pai: any = null, count = 1) {

        var cardView = CardView.getCardView();
        cardView.dir = dir;
        cardView.style = style;
        cardView.pai = pai;
        cardView.count = count;
        cardView.reDraw();

        return cardView;

    }

    static createThreeGroup(dir: number, style: number, pais: any[] = null) {

        if (pais == null) pais = [];

        var group = [];

        for (var i: number = 0; i < 3; i++) {

            var o = GSConfig.getPosByIndex(dir, style, i);

            var cardView = CardView.create(dir, style, pais[i]);

            cardView.posView(o.x, o.y);


            group.push(cardView);
        }

        return group;

    }

    static getCardView() {

        if (CardView.pool.length) {

            return CardView.pool.shift();
        }
        return new CardView();
    }

    static returnCardView(card: CardView) {

        card.reset();

        CardView.pool.push(card);
    }


    //52,76

    dir: number;

    style: number;

    pai: any;

    pos: egret.Point;

    /////////////////////

    bg: egret.Bitmap;

    top: egret.DisplayObjectContainer;

    icon: egret.Bitmap;

    countText: egret.TextField;

    d: egret.Shape;

    pRule: Rule;

    index: number;

    count: number;

    hotArea: egret.Shape;

    maskObj: eui.Rect;

    constructor() {

        super();

        //this.entity = entity;

        this.bg = new egret.Bitmap;
        this.addChild(this.bg);


        this.top = new egret.DisplayObjectContainer();

        this.icon = new egret.Bitmap;


        this.countText = new egret.TextField;

        this.top.addChild(this.icon);
        this.top.addChild(this.countText);

        this.countText.bold = true;
        this.countText.background = true;
        this.countText.backgroundColor = 0;
        this.countText.textColor = 0x8ebd49;
        //this.countText.x = 24;
        this.countText.y = 70;

        this.addChild(this.top);

        this.pos = new egret.Point;

        //
        this.hotArea = new egret.Shape;
        this.hotArea.graphics.beginFill(0, 0);
        this.hotArea.graphics.drawRect(0, 0, 64, 120);
        this.addChild(this.hotArea);
        this.hotArea.anchorOffsetX = GSConfig.posRule[1][1].bgosX;
        this.hotArea.anchorOffsetY = GSConfig.posRule[1][1].bgosY;


/*        this.maskObj = new eui.Rect();
        this.maskObj.width = 64;
        this.maskObj.height = 90;
        this.maskObj.fillColor = 0;
        this.maskObj.fillAlpha = .5;
        this.maskObj.visible = false;
        this.maskObj.touchEnabled = false;
        this.addChild(this.maskObj);
        this.maskObj.anchorOffsetX = GSConfig.posRule[1][1].bgosX;
        this.maskObj.anchorOffsetY = GSConfig.posRule[1][1].bgosY;*/

        this.unactivate();

    }

    activate() {
        this.touchEnabled = true;
        this.hotArea.visible = true;
    }
    unactivate() {
        this.touchEnabled = false;
        this.hotArea.visible = false;
        this.enabled = true;
    }

    set enabled(value) {
        // this.maskObj.visible = !value;
        this.bg.alpha = value ? 1 : .8;
    }

    //重置位置
    resetPos() {

        this.x = this.pos.x;
        this.y = this.pos.y;
    }


    addClick(func: Function, thisObj: any) {

        if (!this.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, func, thisObj);
        }

    }


    posView(x: number, y: number) {

        this.pos.x = x;
        this.pos.y = y;

        this.x = x;
        this.y = y;
    }


    //改变样式
    changeStyle(style: number, draw: boolean = true) {

        this.style = style;

        this.count = 1;

        draw && this.reDraw();
    }

    changePai(pai: any, draw: boolean = true) {

        this.pai = pai;

        this.count = 1;

        draw && this.reDraw();

    }

    showD() {

        this.d = new egret.Shape;
        this.d.graphics.beginFill(0xff0000);
        this.d.graphics.drawRect(0, 0, 10, 10);
        this.addChild(this.d);

    }


    reset() {
        this.posView(0,0);
        this.count = 1;
        this.index = -1;
        this.scaleX = this.scaleY = 1;
        this.visible = true;
        this.unactivate();
        egret.Tween.removeTweens(this);
    }

    reDraw() {

        //var _style  = (this.style == 4 ? 3 : this.style);

        //var _dir = (this.dir == 4 ? 2 : this.dir);

        var type = this.dir * 10 + this.style;

        switch (type) {
            case 11:
            case 12:
            case 13:
                break;
            case 14:
                type = 33;
                break;
            case 15:
                type = 12;
                break;
            case 24:
                type = 23;
                break;
            case 34:
                type = 33;
                break;
            case 41:
                type = 21;
                break;
            case 42:
                type = 22;
                break;
            case 43:
                type = 23;
                break;
            case 44:
                type = 23;
                break;
        }

        var bg_res = "M_" + type;

        this.bg.texture = GameRes.getCard(bg_res);

        if (this.count > 1) {
            this.countText.text = "x" + this.count;
        } else {
            this.countText.text = "";
        }

        if (this.style == 2 || this.style == 5) {

            this.icon.texture = null;
            this.countText.text = "";

        } else {

            if (this.pai != null) {

                var up_res = "Z_" + (this.pai.type * 10 + this.pai.number);

                this.icon.texture = GameRes.getCard(up_res);

            } else {
                this.countText.text = "";

                this.icon.texture = null;
            }

        }


        ////////////////////////////////////////

        this.pRule = GSConfig.posRule[this.dir][this.style];


        this.bg.anchorOffsetX = this.pRule.bgosX;
        this.bg.anchorOffsetY = this.pRule.bgosY;

        this.bg.scaleX = this.pRule.bgScaleX;
        this.bg.scaleY = this.pRule.bgScaleY;


        this.top.anchorOffsetX = this.pRule.toposX;
        this.top.anchorOffsetY = this.pRule.toposY;

        this.top.rotation = this.pRule.topRot;

        this.top.scaleX = this.pRule.topScaleX;
        this.top.scaleY = this.pRule.topScaleY;

    }
}