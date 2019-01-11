import GameConfig from "../config/GameConfig";
import Rope from "./Rope";
import RopePoint from "./RopePoint";
import Tool from "../Tool/Tool";
import Dic from "../Tool/dic";
import Candy from "./Candy";

export default class Spider{
    /**精灵 */
    public sp:Laya.Sprite;
    /**所在层 */
    private view : Laya.Panel
    /**蜘蛛动画*/
    private ani : Laya.Animation;
    /**当前点*/
    private currentPoint : RopePoint;
    /**下一个点*/
    private nextPoint : RopePoint;
    /**绳子 */
    private rope : Rope;
    /**移动距离 */
    private mov : number;
    /**ropeIndex */
    private ropeIndex : number;
    /**candy */
    private candy : Candy;

    constructor(view){
        this.view = view;
    }

    //初始化蜘蛛
    init(data):void{ 
        this.ani = new Laya.Animation();     
        this.ropeIndex = 1;
        this.spider_CreateSprite(data.spider_X,data.spider_Y);        
    }

    //更新状态
    update(data):void{
        this.sp.visible = true;
        this.sp.pos(data.spider_X,data.spider_Y);
    }

    //创建蜘蛛精灵
    spider_CreateSprite(x,y){
        this.sp=new Laya.Sprite();
        this.sp.loadImage("gameView/spider1.png");        
        this.sp.pos(x,y);
        this.sp.pivot(this.sp.width/2,this.sp.height/2);
        this.sp.addChild(this.ani);
        this.view.addChild(this.sp);
    }

    public foundCandy(rope : Rope,candy : Candy) : void
    {
        this.mov = 0;
        this.candy = candy;
        this.rope = rope;
        this.currentPoint = rope.ropePointsArray[this.ropeIndex];
        this.nextPoint = rope.ropePointsArray[this.ropeIndex+1];
        Laya.timer.loop(10,this,this.spider_FollowRope);
    }

    //蜘蛛爬绳
    spider_FollowRope():void
    {
        this.countSpPos();
        this.mov += GameConfig.SPIDER_SPEED;
        if(this.mov >= 1)
        {
            this.mov = 0;
            ++this.ropeIndex;
            if(this.ropeIndex == this.rope.ropePointsArray.length)
            {
                Laya.timer.clear(this,this.spider_FollowRope);
                this.ropeIndex = 0;
                //偷取糖果
                this.rope.ropePointsArray[this.rope.ropePointsArray.length - 1].sp.getComponent(Laya.RevoluteJoint).destroy();
                Laya.timer.loop(16,this,this.followCandy);
                return;
            }
            this.currentPoint = this.rope.ropePointsArray[this.ropeIndex];
            if(this.rope.ropePointsArray[this.ropeIndex + 1])   this.nextPoint = this.rope.ropePointsArray[this.ropeIndex + 1];
        }
    }

    /**计算当前位置 */
    private countSpPos() : void
    {
        let current : any ={};
        let next : any ={};
        current.x = this.currentPoint.sp.x;
        current.y = this.currentPoint.sp.y;
        if(this.currentPoint == this.nextPoint)
        {
            next.x = this.candy.arr_Sp[0].x;
            next.y = this.candy.arr_Sp[0].y;
        }
        else
        {
            next.x = this.nextPoint.sp.x;
            next.y = this.nextPoint.sp.y;
        }
        let sin = Tool.rotationDeal(current.x,current.y,next.x,next.y,"sin");
        let cos = Tool.rotationDeal(current.x,current.y,next.x,next.y,"cos");
        let rotation = Tool.rotateRopePoint_2(current.x,current.y,next.x,next.y);
        let dic = Dic.countDic_Object({x:current.x,y:current.y},{x:next.x,y:next.y});
        //复制
        dic = Math.floor(dic) * this.mov;
        // this.sp.rotation = rotation ;
        this.sp.x = current.x + dic * cos;
        this.sp.y = current.y + dic * sin;
    }
    /**跟随糖果 */
    public followCandy() : void
    {
        this.sp.x = this.candy.arr_Sp[0].x;
        this.sp.y = this.candy.arr_Sp[0].y;
        if(this.candy.arr_Sp[0].y >1330) Laya.timer.clear(this,this.followCandy);
    }

    public hookDestroy() : void
    {
        this.sp.visible = false;
        this.sp.x = 10000;
    }


    /**获得糖果*/
    private getCandy() : void
    {

    }
    /***
     * 蜘蛛行为
     * 
     */
    public monsterAction(aName:string,isLoop?:boolean) : void
    {
        if(!isLoop) isLoop=false;
        this.ani.loadImages(this.aniUrls(aName,this.getAniLength(aName)));
        this.ani.play(0,isLoop);
        this.sp.visible = false;
    } 
    /**
     * 创建一组动画的url数组（美术资源地址数组）
     * @param aniName  动作的名称，用于生成url
     * @param length   动画最后一帧的索引值，
     */
    private aniUrls(aniName:string, length:number) : Array<any>
    {
        var urls: Array<any> = [];
        for (var i=1; i <= length; i++) 
        {
            //动画资源路径要和动画图集打包前的资源命名对应起来
            urls.push("gameView/" + aniName + i + ".png");
        }
        return urls;
    }

    private getAniLength(aName) : number
    {
        switch(aName)
        {
            case GameConfig.ANI_FOUND_CANDY: return 7;
            case GameConfig.ANI_TOWORD_CANDY: return 4;
            case GameConfig.ANI_GET_CANDY: return 2;
        }
    }



    /** */

}