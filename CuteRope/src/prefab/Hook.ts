export default class Hook{
    /**横坐标 */
	public hook_X:number;
	/**纵坐标 */
    public hook_Y:number;
    /**钩子类型 */
    public style : string;
    /**精灵 */
    public sp:Laya.Sprite;
    /**所在层 */
    private view : Laya.Panel
    /**是否已创建 */
    public isCreate : boolean;

    constructor(view){
        this.view = view;
    }

    //初始化,"hook1"为钩子风格1，"hook2"为钩子风格2，检测糖果是否在设定范围内，如果在就生成新的绳子
    init(data):void{
        this.hook_X=data.hook_X;
        this.hook_Y=data.hook_Y;         
        this.isCreate = false;     
        this.style = data.style;  
        // if(data.style=="hook1"){
        //     this.hook_CreateSprite(data.hook_X,data.hook_Y,data.style);
        // }else if(data.style=="hook2"){
        //     this.hook_CreateSprite(data.hook_X,data.hook_Y,data.style);
        // }
        this.hook_CreateSprite(data.hook_X,data.hook_Y,data.style);        
        if(data.style == "hook2")/////////没有图片
        {
            let spp = new Laya.Sprite();
            spp.graphics.drawCircle(24,20,150,"#a24");
            spp.alpha = 0.2;
            this.sp.addChild(spp);
        }
    }
    
    //更新状态
    update(data):void{
        this.isCreate = false; 
        this.sp.visible = true;
        this.hook_X=data.hook_X;
        this.hook_Y=data.hook_Y;
        this.style = data.style;          
        // if(data.style=="hook1"){
        //     this.sp.loadImage("gameView/"+data.style+".png");
        //     this.sp.pos(data.hook_X,data.hook_Y);
        // }else if(data.style=="hook2"){
        //     this.hook_CreateSprite(data.hook_X,data.hook_Y,data.style);
        // }
        this.sp.loadImage("gameView/"+"hook1"+".png");

        // this.sp.loadImage("gameView/"+data.style+".png");
        this.sp.pos(data.hook_X,data.hook_Y);
    }

    //创建钩子精灵
    hook_CreateSprite(x,y,style){
        this.sp=new Laya.Sprite();
        this.sp.loadImage("gameView/"+"hook1"+".png");
        
        // this.sp.loadImage("gameView/"+style+".png");
        this.sp.pos(x,y);
        this.sp.pivot(this.sp.width/2,this.sp.height/2);
        this.view.addChild(this.sp);
    }

    public hookDestroy() : void
    {
        this.sp.visible = false;
        this.isCreate = false;
        this.sp.x = 10000;
    }

    //检测与糖果得距离，距离内生成绳子
    hook_CreateRope():void{
        
    }
}