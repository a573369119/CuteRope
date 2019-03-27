export default class AntiGravity
{
    /**反重力按钮*/
    private sp:Laya.Sprite;
    /**旋转图片*/
    private rotateSp:Laya.Sprite;
    /**是否为反转后的重力 */
    private isReverse:boolean;
    /**加入的层 */
    public view : Laya.Panel;

    constructor(view)
    {
        this.view=view;
    }

    //初始化
    init(data):void
    {
        this.anti_CreateSprite(data.x,data.y);
        this.isReverse=false;
        this.sp.on(Laya.Event.MOUSE_DOWN,this,this.anti_OnClick);
    }

    update(data):void
    {
        this.sp.visible=true;
        this.sp.loadImage("gameView/antiGravity/anti_down.png");
        this.sp.pos(data.x,data.y);
        this.sp.on(Laya.Event.MOUSE_DOWN,this,this.anti_OnClick);
        Laya.Physics.I.gravity={x:0,y:10};
        this.isReverse=false;
    }

    //创建精灵
    anti_CreateSprite(x,y):void
    {
        //创建按钮
        this.sp=new Laya.Sprite();
        this.sp.autoSize=true;
        this.sp.loadImage("gameView/antiGravity/anti_down.png",Laya.Handler.create(this,this.CallBack));
        this.sp.pos(x,y);
        this.sp.visible=true;
        this.view.addChild(this.sp);
    }

    CallBack():void
    {      
        this.sp.pivot(this.sp.width/2,this.sp.height/2);
    }

    //按钮点击事件
    anti_OnClick():void
    {
        this.isReverse=!this.isReverse;
        if(this.isReverse)
        {
            this.sp.loadImage("gameView/antiGravity/anti_up.png");
            Laya.Physics.I.gravity={x:0,y:-10};
        }
        else
        {
            this.sp.loadImage("gameView/antiGravity/anti_down.png");
            Laya.Physics.I.gravity={x:0,y:10};
        }
        
    }

    //移除事件
    removeEvent():void
    {
        this.sp.off(Laya.Event.MOUSE_DOWN,this,this.anti_OnClick);
    }

    /**假销毁 */
    public destroy():void
    {
        this.sp.visible = false;
        this.sp.x = -1000;
    }
}