import Dic from "../Tool/dic";
import Tool from "../Tool/Tool";
import RopePoint from "./RopePoint";

export default class Bee{
    /**蜜蜂精灵 */
    public sp:Laya.Sprite;
    /**世界视图 */
    public view:Laya.Panel;
    /**蜜蜂动画 */
    public beeAni : Laya.Animation;
    /**蜜蜂路径 */
    public road : Array<any>;
    /**蜜蜂速度 */
    public beeSpeed : number; 
    /**蜜蜂所在hook */
    public hookIndex : number;
    /**所有hook对象 */
    public arr_Hook : Array<any>;
    /**蜜蜂运动speed */
    public speed : number;
    /**路径记录点 */
    public remRoad : number;
    /**方向 */
    public dir : number;
    /**绳子节点 */
    public ropePoint : RopePoint;
    public arr_RopePoint : Array<RopePoint>;

    constructor(view){
        this.view = view;
    }
    
    /**初始化 */
    public init(data,arr_Hook) : void
    {
        this.setData(data,arr_Hook);
        this.createSp(this.road[0].x,this.road[0].y);
        this.creatBeenAni();
    }
    
    /**更新 */
    public update(data,arr_Hook) : void
    {
        this.setData(data,arr_Hook);
        this.createSp(this.road[0].x,this.road[0].y);
        this.creatBeenAni();
    }
    
    /**设置数值 */
    private setData(data,arr_Hook) : void
    {
        this.arr_RopePoint = [];
        this.arr_Hook = arr_Hook;
        this.hookIndex = data.hookIndex;
        this.road = data.road;
        this.speed = data.speed;
        this.remRoad = 0;
        this.dir = 1;
    }

    /**设置绳子节点 */
    public setRopePoint(ropePoint) : void
    {
        this.arr_RopePoint.push(ropePoint);
    }

    /**创建sp、创建动画*/
    public createSp(x,y) : void
    {
        if(!this.sp)
        {
            this.sp = new Laya.Sprite();
            this.sp.width = 86;
            this.sp.height = 78
            this.sp.pivot(this.sp.width/2+5,this.sp.height);
            this.view.addChild(this.sp);
        }
        this.sp.visible = true;
        this.sp.x = x;
        this.sp.y = y;
    }

    /**销毁 */
    public clearTimer() : void
    {
        this.arr_RopePoint = [];        
        this.sp.visible = false;
        this.arr_Hook = undefined;
        Laya.timer.clear(this,this.moveRoad);
    }   

    /**动画加载 */
    public creatBeenAni() : void
    {
        if(this.beeAni) return;
        this.beeAni = new Laya.Animation();
        let arr=[
            "gameView/Bee/0.png",
            "gameView/Bee/1.png",
        ];
        this.beeAni.loadImages(arr);
        this.beeAni.interval = 40;
        this.beeAni.play(0,true);
        this.sp.addChild(this.beeAni);
    }


    /**蜜蜂移动 */
    public beeMove() : void
    {
        Laya.timer.loop(16,this,this.moveRoad);
    }

    /**按路径移动 */
    private moveRoad() : void
    {
        let currentPos = this.road[this.remRoad];
        let nextPos = this.road[this.remRoad + this.dir];
        let ropePoint ;
        if(!currentPos)  console.log("路径点出错请查看一下 bee.ts");
        
        let cos = Tool.rotationDeal(nextPos.x,nextPos.y,currentPos.x,currentPos.y,"cos");
        let sin = Tool.rotationDeal(nextPos.x,nextPos.y,currentPos.x,currentPos.y,"sin");
        let dic = Dic.countDic_Object(nextPos,currentPos);
        
        this.sp.x -= 2.5*cos*this.speed;
        this.sp.y -= 2.5*sin*this.speed;

        //影响hook
        if(this.arr_RopePoint.length>0)
        {
            for(let h = 0; h<this.arr_RopePoint.length; h++)
            {
                ropePoint = this.arr_RopePoint[h];
                for(let i=0; i<this.arr_Hook.length;i++)
                {
                    if(i == this.hookIndex)
                    {
                        if(this.arr_Hook[i].ropePoint){ropePoint = this.arr_Hook[i].ropePoint}
                        this.arr_Hook[i].followBee({x:this.sp.x,y:this.sp.y},ropePoint);
                    }
                }
            }
        }
        else
        {
            for(let i=0; i<this.arr_Hook.length;i++)
            {
                if(i == this.hookIndex)
                {
                    if(this.arr_Hook[i].ropePoint){ropePoint = this.arr_Hook[i].ropePoint}
                    this.arr_Hook[i].followBee({x:this.sp.x,y:this.sp.y},ropePoint);
                }
            }
        }

        if(Dic.countDic_Object(nextPos,{x:this.sp.x,y:this.sp.y})<5)
        {
            this.sp.x = nextPos.x;
            this.sp.y = nextPos.y;
            this.remRoad += this.dir;//自加
            if(this.remRoad == 0) this.dir = 1;
            if(this.remRoad == this.road.length - 1) 
            {
                this.dir = -1;
                if(this.road[this.remRoad].x == this.road[0].x && this.road[this.remRoad].y == this.road[0].y && this.road.length>2)
                {
                    this.remRoad = 0;
                    this.dir = 1;
                }
            }
        }
    }
}