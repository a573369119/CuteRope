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
    public spCircle:Laya.Sprite;
    /**所在层 */
    private view : Laya.Panel
    /**是否已创建 */
    public isCreate : boolean;
	/**旋转的角度 */
    public Rotation:number;
	/**可移动绳子得底图数组 */
    public hooksliderBgArray:Array<Laya.Sprite>;
    /**鼠标在hook范围内按下 */
    public isHookMouseDown:boolean;
    /**范围 */
    public size : number;
    /**Top */
    public imgTop : Laya.Image;
    /**Bottom */
    public imgBottom : Laya.Image;

    constructor(view){
        this.view = view;
    }

    //初始化,"hook1"为钩子风格1，"hook2"为钩子风格2，检测糖果是否在设定范围内，如果在就生成新的绳子
    init(data,size?):void{
        this.hook_X=data.hook_X;
        this.hook_Y=data.hook_Y;         
        this.isCreate = false;     
		this.isHookMouseDown=false;
        this.style = data.style;  
        this.size = size;
        this.hook_CreateSprite(data.hook_X,data.hook_Y,data.style);        
        if(data.style == "hook2")/////////没有图片
        {
            this.hook2_createCircle();
        }
        else if(data.style=="hookslider")
        {   
            this.hooksliderBgArray=new Array<Laya.Sprite>();
            this.Rotation=data.rotation; 
            this.hookslider_CreateMove(data.move);
            this.sp.on(Laya.Event.MOUSE_DOWN,this,this.hookslider_MouseDown,[data.move]);
            this.sp.on(Laya.Event.MOUSE_UP,this,this.hookslider_MouseUp);
        }
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
            if(this.spCircle)
            {
                this.spCircle.visible = true;
            }
            else
            {
                this.hook2_createCircle();
            }
        }
        else
        {
            if(this.spCircle)
            {
                this.spCircle.visible = false;
            }
			
			if(data.style == "hookslider"){
                this.imgBottom.skin = "gameView/" + this.style + ".png";
                this.Rotation=data.rotation; 
                this.hookslider_CreateMove(data.move);
                this.sp.on(Laya.Event.MOUSE_DOWN,this,this.hookslider_MouseDown,[data.move]);
                this.sp.on(Laya.Event.MOUSE_UP,this,this.hookslider_MouseUp);
            }
        }
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
	
	//若是hook2,创建圈
    private hook2_createCircle() : void
    {
        this.spCircle = new Laya.Image();
        this.spCircle.loadImage("gameView/ropeRage.png");
        this.spCircle.width = this.size*2;
        this.spCircle.height = this.size*2;
        this.spCircle.pivot(this.spCircle.width/2,this.spCircle.height/2);
        this.sp.addChild(this.spCircle);
    }
	
    private setHookBottom() {
        this.imgBottom = new Laya.Image();
        this.imgBottom.loadImage("gameView/" + this.style + ".png");
        this.imgBottom.pivot(50 / 2, 43 / 2);
        this.imgBottom.pos(0, 0);
        this.sp.width = this.imgBottom.width;
        this.sp.height = this.imgBottom.height;
        this.sp.addChild(this.imgBottom);
        return this.imgBottom;
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

    //若是hookslider,创建移动范围,move[0]为0时，滑动杆水平；从左至右摆放；move[0]为90时，滑动杆竖直；从上至下摆放
    private hookslider_CreateMove(move:Array<number>):void{
        let count=Math.floor((move[1]-move[0])/24);
        for(let i=0;i<=count;i++){
            if(this.hooksliderBgArray[i]){
                this.hooksliderBgArray[i].visible=true;
            }else{
                let hooksliderbg=new Laya.Sprite();            
                    hooksliderbg.zOrder=0.5;
                    this.view.addChild(hooksliderbg);
                    this.hooksliderBgArray.push(hooksliderbg);         
            }
            if(i==0){
                this.hooksliderBgArray[i].loadImage("gameView/hookslider_root1.png");
            }else if(i==count){
                this.hooksliderBgArray[i].loadImage("gameView/hookslider_root2.png");
            }else{
                this.hooksliderBgArray[i].loadImage("gameView/hooksliderbg.png");
            }
            this.hooksliderBgArray[i].pivot(this.hooksliderBgArray[i].width/2,this.hooksliderBgArray[i].height/2);
            this.hooksliderBgArray[i].rotation=this.Rotation;
            if(this.Rotation==0){
                this.hooksliderBgArray[i].pos(move[0]+i*this.hooksliderBgArray[i].width,this.sp.y);
            }else if(this.Rotation==90){
                this.hooksliderBgArray[i].pos(this.sp.x,move[0]+i*this.hooksliderBgArray[i].width);
            }
        }
    }

    /**当style为hookslider时，判断可移动范围 */
    private hookslider_judgeRange(move:Array<number>):void{
        if(this.Rotation==0){
            if(Laya.stage.mouseX<=move[0]){
                this.sp.pos(move[0],this.sp.y);
            }else if(Laya.stage.mouseX>=move[1]){
                this.sp.pos(move[1],this.sp.y);
            }else{
                this.sp.pos(Laya.stage.mouseX,this.sp.y);
            }
        }else if(this.Rotation==90){
            if(Laya.stage.mouseY<=move[0]){
                this.sp.pos(this.sp.x,move[0]);
            }else if(Laya.stage.mouseY>=move[1]){
                this.sp.pos(this.sp.x,move[1]);
            }else{
                this.sp.pos(this.sp.x,Laya.stage.mouseY);
            }
        }
    }
    /**为hookslider添加鼠标事件 1 */
    private hookslider_MouseDown(move:Array<number>){
        this.isHookMouseDown=true;
        Laya.stage.on(Laya.Event.MOUSE_MOVE,this,this.hookslider_MouseMove,[move]);
    }

    /**为hookslider添加鼠标事件 2 */
    private hookslider_MouseMove(move:Array<number>){
        this.hookslider_judgeRange(move);
    }

    /**为hookslider添加鼠标事件 3 */
    private hookslider_MouseUp(){
        this.isHookMouseDown=false;
        Laya.stage.off(Laya.Event.MOUSE_MOVE,this,this.hookslider_MouseMove);
    }

    public removeEvent():void{
        if(this.style == "hookslider"){
            this.sp.off(Laya.Event.MOUSE_DOWN,this,this.hookslider_MouseDown);
            Laya.stage.on(Laya.Event.MOUSE_MOVE,this,this.hookslider_MouseMove);
            this.sp.off(Laya.Event.MOUSE_UP,this,this.hookslider_MouseUp);
        }
        
    }
	
	public hookDestroy() : void
    {
        this.sp.visible = false;
        this.isCreate = false;
        this.sp.x = 10000;
        this.imgTop.visible = false;
        if(this.hooksliderBgArray)
        {
            for(let i=0;i<this.hooksliderBgArray.length;i++){
                this.hooksliderBgArray[i].visible=false;
                this.hooksliderBgArray[i].x=10000;
            }
        }   
        this.removeEvent();
    }
}