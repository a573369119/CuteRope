export default class Hook{
    /**横坐标 */
	public hook_X:number;
	/**纵坐标 */
    public hook_Y:number;
    /**钩子类型 */
    public style : string;
    /**精灵 */
    public sp:Laya.Sprite;
    constructor(){

    }

    //初始化,"hook1"为钩子风格1，"hook2"为钩子风格2，检测糖果是否在设定范围内，如果在就生成新的绳子
    init(data):void{
        this.hook_X=data.hook_X;
        this.hook_Y=data.hook_Y;
        if(data.style=="hook1"){
            this.hook_CreateSprite(data.hook_X,data.hook_Y,data.style);
        }else if(data.style=="hook2"){
            /*this.hook_CreateSprite(data.hook_X,data.hook_Y,data.style);
            this.hook_CreateRope();*/
        }
        
    }
    
    //更新状态
    update(data):void{
        this.sp.visible = true;
        this.hook_X=data.hook_X;
        this.hook_Y=data.hook_Y;
        if(data.style=="hook1"){
            this.sp.loadImage("gameView/"+data.style+".png");
            this.sp.pos(data.hook_X,data.hook_Y);
        }else if(data.style=="hook2"){
            /*this.sp.loadImage("gameView/"+data.style+".png");
            this.sp.pos(hook_X,hook_Y);
            this.hook_CreateRope();*/
        }
    }

    //创建钩子精灵
    hook_CreateSprite(x,y,style){
        this.sp=new Laya.Sprite();
        this.sp.loadImage("gameView/"+style+".png");
        this.sp.pos(x,y);
        this.sp.pivot(this.sp.width/2,this.sp.height/2);
        Laya.stage.addChild(this.sp);
    }

    //检测与糖果得距离，距离内生成绳子
    hook_CreateRope():void{
        
    }
}