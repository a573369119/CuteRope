import GameConfig from "../config/GameConfig";
import Balloon from "./Balloon";
import { BouceDrum } from "./bounceDrum";
import Hook from "./Hook";
import Rope from "./Rope";

/**云朵 */
export default class Cloud{
    /**x */
    public x : number;
    /**y */
    public y : number;
    /**样式数组 */
    public style : Array<String>;
    /**泡泡的Index */
    public balloonIndex : number;
    /**弹力鼓Index */
    public bounceDrumIndex : number;
    /**hookIndex */
    public hookIndex : number;
    /**动画 - 悬浮 1*/
    public ani1 : Laya.Animation;
    /**动画 - 散开 2 */
    public ani2 : Laya.Animation;
    /**精灵  88*41 */
    public sp : Laya.Sprite;
    /**幽灵图片 */
    public uling : Laya.Image;
    /**视图层 */
    private view : any;
    /**状态 */
    private isUling : boolean;
    /**形态下标 */
    private index : number;
    /**泡泡 */
    private arr_balloon : Array<Balloon>;
    private balloonData : any;
    private arr_bounceDrum : Array<BouceDrum>;
    private arr_hook : Array<Hook>;
    private hookData : any;
    private arr_Rope:Array<Rope>;
    /**当前显示 */
    private currentShow : any;


    constructor(view){
        this.view = view;
    }

    /**初始化 */
    public init(data) : void
    {
        this.init_data(data);
        this.init_sprite(data);
        this.init_ani(data);
        this.addEvent();
    }
    /**更新 */
    public update(data) : void
    {
        this.init_data(data);
        this.init_sprite(data);
        this.init_ani(data);
        this.addEvent();        
    }
    /**数据初始化 */
    private init_data(data) : void
    {
        this.x = data.x;
        this.y = data.y;   
        this.isUling = true;
        this.index = 0;
        this.style = data.style;
        this.balloonIndex = data.balloonIndex;
        this.bounceDrumIndex = data.bounceDrumIndex;
        this.hookIndex = data.hookIndex;
    }
    /**设置数组 */
    public setArray(arr_balloon,balloonData,arr_bouceDrum,arr_hook,hookData,arr_rope) : void
    {
        this.arr_balloon = arr_balloon;
        this.balloonData = balloonData;
        this.arr_bounceDrum = arr_bouceDrum;
        this.arr_hook = arr_hook;
        this.hookData = hookData;
        this.arr_Rope = arr_rope;
    }
    /**精灵初始化 */
    private init_sprite(data) : void
    {
        if(!this.sp)
        {
            this.sp = new Laya.Sprite();
            this.sp.width = 100;
            this.sp.height = 88;
            this.sp.zOrder = GameConfig.ZORDER_CLOUD;
            this.sp.pivot(44,21);
            this.view.addChild(this.sp);

            this.uling = new Laya.Image();
            this.uling.loadImage("gameView/cloud/cloud.png");
            this.uling.width = 46*1.8;
            this.uling.height = 59*1.8;
            this.sp.addChild(this.uling);
        }
        this.sp.pos(this.x,this.y);
    }

    /**动画初始化 */
    private init_ani(data) : void
    {
        if(!this.ani1 && !this.ani2)
        {
            this.ani1 = new Laya.Animation();
            this.ani2 = new Laya.Animation();
            this.ani1.loadAnimation("GameView/ani/Cloud2.ani");//悬浮
            this.ani2.loadAnimation("GameView/ani/Cloud.ani");
            this.ani1.visible = false;
            this.ani2.visible = false;
            this.ani1.pivot(this.ani1.width/2,this.ani1.height/2);
            this.ani2.pivot(this.ani2.width/2,this.ani2.height/2);
            this.ani1.x =44;
            this.ani1.y =44;
            this.ani2.x =44;
            this.ani2.y =21;
            this.sp.addChild(this.ani1);
            this.sp.addChild(this.ani2);
        }
    }
    /**添加事件*/
    private addEvent() : void
    {
        this.sp.on(Laya.Event.CLICK,this,this.change);
        this.sp.visible = true;
    }

    /** 改变形态 */
    private change() : void
    {
        this.ani2.visible = true;
        this.ani2.play(0,false);
        this.ani1.stop();
        this.ani1.visible = false;
        Laya.timer.once(500,this,this.onAni2);
        
        if(this.isUling)
        {
            this.uling.alpha = 0;
            if(this.currentShow)
            {
                this.currentShow.sp.x = -1000;
                this.currentShow.sp.y = -1000;
            }

            //判断绳子是否背隔断
            this.isCuted();
            switch(this.style[this.index])
            {
                case "balloon":
                    this.currentShow = this.arr_balloon[this.balloonIndex];
                    break;
                case "bounceDrum":
                    this.currentShow = this.arr_bounceDrum[this.bounceDrumIndex];
                    break;
                case "hook":
                    this.arr_hook[this.hookIndex].update({"hook_X":this.hookData[this.hookIndex].hook_X,"hook_Y":this.hookData[this.hookIndex].hook_Y,"style":this.hookData[this.hookIndex].style,"rotation":this.hookData[this.hookIndex].rotation,"length":this.hookData[this.hookIndex].length,"percent":this.hookData[this.hookIndex].percent},this.hookData[this.hookIndex].canRotate,this.hookData[this.hookIndex].size);
                    this.currentShow = this.arr_hook[this.hookIndex];
                    break;
                default : 
                    this.index = 0;
                    this.currentShow = this["arr_"+ this.style[0]][this[this.style[0]+"Index"]];
                    break;
            }
                    
            if(this.style[this.index] == "balloon") this.currentShow.setCall(this,this.candyGet);
                 else if(this.balloonIndex) this.arr_balloon[this.balloonIndex].setCall(undefined,undefined);                    
                    
            this.currentShow.sp.x = this.x;
            this.currentShow.sp.y = this.y;
            this.index++;
        }
    }
    
    /**是否被割断 */
    private isCuted() : void
    {
        this.arr_Rope.forEach(rope => {
            if(rope.hookIndex == this.hookIndex)
            {
                if(!rope.isCuted)
                {
                    rope.ropeCuted();
                }
            }       
        });
    }
    /**this.onAni2 */
    private onAni2() : void
    {
        if(this.ani1.isPlaying)  return;
        this.ani1.play(0,true);
        this.ani1.visible = true;
        this.ani2.visible = false;
    }

    /**糖果接触回调 */
    private candyGet() : void
    {
        this.arr_balloon[this.balloonIndex].setCall(this,this.balloonBoom);
        this.arr_balloon[this.balloonIndex].isFirstCaller = false;
        console.log("接触糖果");
        this.sp.visible = false;
        this.ani1.visible = false;
        this.ani2.visible = false;
    }

    /**气泡爆炸回调 */
    private balloonBoom() : void
    {
        this.sp.visible = true;
        this.ani1.visible = false;
        this.ani2.visible = false;
        this.uling.alpha = 1;
        this.index = 0;
        this.arr_balloon[this.balloonIndex].update(this.balloonData[this.balloonIndex]);
        this.arr_balloon[this.balloonIndex].isFirstCaller = true;   
        this.arr_balloon[this.balloonIndex].setCall(undefined,undefined);
        console.log("泡泡爆炸");
        
    }

    /**销毁 */
    public clearTimer() : void
    {
        this.ani1.visible = false;
        this.ani2.visible = false;
        this.uling.visible = true;
        this.sp.visible = true;
        this.uling.alpha = 1;        
        this.isUling = true;
        this.index = 0;
        if(this.arr_balloon)
        {
            if(this.arr_balloon[this.balloonIndex])
            {
                this.arr_balloon[this.balloonIndex].update(this.balloonData[this.balloonIndex]);
                this.arr_balloon[this.balloonIndex].isFirstCaller = true;   
            }
        }
        Laya.timer.clear(this,this.onAni2);
        this.sp.off(Laya.Event.CLICK,this,this.change);
    }
}