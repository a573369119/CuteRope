import GameConfig from "../config/GameConfig";

export default class Hook{
    /**横坐标 */
	public hook_X:number;
	/**纵坐标 */
    public hook_Y:number;
    /**钩子类型 */
    public style : string;
    /**精灵 */
    public sp:Laya.Sprite;
    /**画圈 */
    public spp:Laya.Sprite;
    /**所在层 */
    private view : Laya.Panel
    /**是否已创建 */
    public isCreate : boolean;
    /**范围 */
    public size : number;
    /**Top */
    public imgTop : Laya.Image;

    constructor(view){
        this.view = view;
    }

    //初始化,"hook1"为钩子风格1，"hook2"为钩子风格2，检测糖果是否在设定范围内，如果在就生成新的绳子
    init(data,size?):void{
        this.hook_X=data.hook_X;
        this.hook_Y=data.hook_Y;         
        this.isCreate = false;     
        this.style = data.style;  
        this.size = size;
        // if(data.style=="hook1"){
        //     this.hook_CreateSprite(data.hook_X,data.hook_Y,data.style);
        // }else if(data.style=="hook2"){
        //     this.hook_CreateSprite(data.hook_X,data.hook_Y,data.style);
        // }
        this.hook_CreateSprite(data.hook_X,data.hook_Y,data.style);        
        if(data.style == "hook2")/////////没有图片
        {
            this.createSpp();
        }
    }
    //创建圈
    private createSpp() : void
    {
        this.spp = new Laya.Image();
        this.spp.loadImage("gameView/ropeRage.png");
        this.spp.width = this.size*2;
        this.spp.height = this.size*2;
        this.spp.pivot(this.spp.width/2,this.spp.height/2);
        this.sp.addChild(this.spp);
    }

    //更新状态
    update(data,size?):void{
        this.isCreate = false; 
        this.sp.visible = true;
        this.hook_X=data.hook_X;
        this.hook_Y=data.hook_Y;
        this.style = data.style; 
        this.size = size;  
        this.imgTop.visible = true;   
        this.setHookTop(data.hook_X,data.hook_Y)    
        if(data.style == "hook2")/////////没有图片
        {
            if(this.spp)
            {
                this.spp.visible = true;
            }
            else
            {
                this.createSpp();
            }
        }
        else
        {
            if(this.spp)
            {
                this.spp.visible = false;
            }
        }
        // this.sp.loadImage("gameView/"+"hook1"+".png");
        // this.sp.loadImage("gameView/"+data.style+".png");
        this.sp.pos(data.hook_X,data.hook_Y);
    }

    //创建钩子精灵
    hook_CreateSprite(x,y,style){
        this.sp=new Laya.Sprite();
        //hook图片
        this.setHookBottom();
        //Hook顶部
        this.setHookTop(x, y);
        this.sp.pivot(this.sp.width/2,this.sp.height/2);
        // this.sp.loadImage("gameView/"+"hook1"+".png");
        // this.sp.loadImage("gameView/"+style+".png");
        this.sp.pos(x,y);
        this.view.addChild(this.sp);
    }

    private setHookBottom() {
        let img = new Laya.Image();
        img.loadImage("gameView/" + "hook1" + ".png");
        img.pivot(50 / 2, 43 / 2);
        img.pos(0, 0);
        this.sp.width = img.width;
        this.sp.height = img.height;
        this.sp.addChild(img);
        return img;
    }

    private setHookTop(x: any, y: any) {
        if(!this.imgTop)
        {
            this.imgTop = new Laya.Image();
            this.imgTop.loadImage("gameView/hookTop.png");
            this.imgTop.pivot(20 / 2, 10 / 2);
            this.imgTop.zOrder = GameConfig.ZORDER_HOOK_TOP;
            this.view.addChild(this.imgTop);
        }
        this.imgTop.pos(0, 0);
        this.imgTop.pos(x + 2, y - 3);
    }

    public hookDestroy() : void
    {
        this.sp.visible = false;
        this.isCreate = false;
        this.sp.x = 10000;
        this.imgTop.visible = false;
    }

    //检测与糖果得距离，距离内生成绳子
    hook_CreateRope():void{
        
    }
}