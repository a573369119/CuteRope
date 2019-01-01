/**
 * 魔术帽
 */
export default class MagicHat {
    /**帽子精灵*/
    public sp : Laya.Sprite;
    /**帽子动画 */
    public ani_enter : Laya.Animation;
    /**所要加入的视图*/
    public view : Laya.Panel;
    /**color 优先出红色帽子*/
    public color : string;
    /** 帽子的角度 */
    public rotation : number;
    /**帽子图片 */
    public img : Laya.Image;

    constructor(x,y,rotation,view,color){
        this.view = view;
        this.loadAnimation(color);
        this.init(x,y,rotation,color);
    }


    /***帽子初始化 */
    private  init(x,y,rotation,color) : void
    {
        this.createSprite(x,y,rotation,color);
    }
    
    /**帽子更新 */
    public update(x,y,rotation) : void
    {
        this.sp.x = x;
        this.sp.y = y;     
        this.sp.rotation = rotation;
        this.sp.visible = true;
    }

    private createSprite(x,y,rotation,color) :  void
    {
        if(!this.sp)
        {
            this.sp = new Laya.Sprite();
            this.img = new Laya.Image();
        }
        this.sp.x = x;
        this.sp.y = y;
        this.img.skin = "gameView/hat_" + color + ".png";
        this.sp.width = this.img.width;
        this.sp.height = this.sp.height;
        this.sp.addChild(this.img);
        this.sp.rotation = rotation;   
        this.sp.pivot(this.img.width/2,this.img.height/2);
        this.view.addChild(this.sp);
    }

    /**播放动画 */
    public playAnimation(x,y) : void
    {

    }

    /**动画加载 */
    private loadAnimation(color) : void
    {

    }

    /**假销毁 */
    public destroy() : void
    {
        this.sp.visible = false;
        this.sp.x = 100000;
    }

}