export default class Spider{
    /**精灵 */
    public sp:Laya.Sprite;
    /**所在层 */
    private view : Laya.Panel

    constructor(view){
        this.view = view;
    }

    //初始化蜘蛛
    init(data):void{      
        this.spider_CreateSprite(data.spider_X,data.spider_Y);        
    }

    //更新状态
    update(data):void{
        this.sp.pos(data.spider_X,data.spider_Y);
    }

    //创建蜘蛛精灵
    spider_CreateSprite(x,y){
        this.sp=new Laya.Sprite();
        this.sp.loadImage("gameView/spider1.png");        
        this.sp.pos(x,y);
        this.sp.pivot(this.sp.width/2,this.sp.height/2);
        this.view.addChild(this.sp);
    }

    //蜘蛛爬绳
    spider_FollowRope(ropePoints:Array<any>):void{
        
    }
    public hookDestroy() : void
    {
        this.sp.visible = false;
        this.sp.x = 10000;
    }
}