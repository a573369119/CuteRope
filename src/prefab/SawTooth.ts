export default class AntiGravity
{
    /**精灵数组 */
    public spArray:Array<Laya.Sprite>;
    /**是否水平放置数组 */
    private rotationArray:Array<number>;
    /**是否顺时针旋转 */
    private clockwisenArray:Array<boolean>;
    /***是否碰撞 */
    public isCollision : boolean;
    /**加入的层 */
    public view : Laya.Panel;
    constructor(view)
    {
        this.view=view;
    }

    init(data):void
    {
        this.isCollision=false;
        this.spArray=new Array<Laya.Sprite>();
        this.rotationArray=new Array<number>();
        this.clockwisenArray=new Array<boolean>();
        for(let i=0;i<data.info.length;i++){
            this.sawTooth_CreateSprite(data.info[i].x,data.info[i].y,data.color,data.info[i].rotation);
            this.rotationArray[i]=data.info[i].rotation;
            this.clockwisenArray[i]=data.info[i].clockwise;
        }
    }

    update(data):void
    {
        this.isCollision=false;
        for(let i=0;i<data.info.length;i++){
            this.spArray[i].pos(data.info[i].x,data.info[i].y);
            this.spArray[i].loadImage("gameView/SawTooth/"+data.color+".png",Laya.Handler.create(this,this.CallBack,[this.spArray[i]]));
            this.rotationArray[i]=data.info[i].rotation;
            this.clockwisenArray[i]=data.info[i].clockwise;
            this.spArray[i].on(Laya.Event.MOUSE_DOWN,this,this.sawTooth_OnClick);
            this.spArray[i].visible=true;
            this.spArray[i].rotation=data.info[i].rotation;
        }
    }

    sawTooth_CreateSprite(x,y,color,rotation)
    {
        let sp=new Laya.Sprite();
            sp.loadImage("gameView/SawTooth/"+color+".png",Laya.Handler.create(this,this.CallBack,[sp]));
            sp.pos(x,y);            
            sp.on(Laya.Event.MOUSE_DOWN,this,this.sawTooth_OnClick);
            sp.visible=true;
            sp.rotation=rotation;
            this.view.addChild(sp);      
            this.spArray.push(sp);  
    }

    //图片加载回调
    CallBack(sp:Laya.Sprite):void
    {
        sp.pivot(sp.width/2,sp.height/2);
    }

    sawTooth_OnClick():void
    {
        let limitArray:Array<number>=new Array<number>();
        for(let i=0;i<this.spArray.length;i++){
            if(this.spArray[i].rotation!=this.rotationArray[i])
            {
                limitArray[i]=this.rotationArray[i];
            }
            else 
            {
                if(this.clockwisenArray[i])
                {
                    limitArray[i]=this.rotationArray[i]+90;
                }
                else
                {
                    limitArray[i]=this.rotationArray[i]-90;
                }
            }
        }
        //开启旋转
        Laya.timer.frameLoop(1,this,this.sawTooth_RotateBy,[limitArray]);    
    }

    sawTooth_RotateBy(limitArray:Array<number>):void
    {
        for(let i=0;i<this.spArray.length;i++)
        {
            if(this.clockwisenArray[i])
                {
                    this.spArray[i].rotation+=6;
                    if(this.spArray[i].rotation>=limitArray[i])
                    {                        
                        this.spArray[i].rotation=limitArray[i];
                        this.clockwisenArray[i]=false;
                        Laya.timer.clear(this,this.sawTooth_RotateBy);    
                    }
                }
            else
                {
                    this.spArray[i].rotation-=6;
                    if(this.spArray[i].rotation<=limitArray[i])
                    {
                        this.spArray[i].rotation=limitArray[i];
                        this.clockwisenArray[i]=true;
                        Laya.timer.clear(this,this.sawTooth_RotateBy);
                    }
                }
            }  
    }
    //移除事件
    removeEvent():void
    {
        for(let i=0;i<this.spArray.length;i++){
            this.spArray[i].off(Laya.Event.MOUSE_DOWN,this,this.sawTooth_OnClick);
        }
    }

    public clearTimer():void{
        Laya.timer.clearAll(this);
    }

    /**假销毁 */
    public destroy():void
    {
        for(let i=0;i<this.spArray.length;i++){
            this.spArray[i].x=1000;
            this.spArray[i].visible=false;
        }
    }
}