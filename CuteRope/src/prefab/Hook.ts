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
    constructor(view){
        this.view = view;
    }

    /**
      初始化：
      "hook1"为钩子风格1，move和rotation随便取不影响
      "hook2"为钩子风格2，检测糖果是否在设定范围内，如果在就生成新的绳子,move和rotation随便取不影响；
      "hookslider"为钩子风格3，先创建一条移动杆，让钩子在移动杆范围内移动，移动杆根据move和rotation创建
    */
    init(data):void{
        this.hook_X=data.hook_X;
        this.hook_Y=data.hook_Y;        
        this.isCreate = false;     
        this.isHookMouseDown=false;
        this.style = data.style;  
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
    update(data):void{
        this.isCreate = false; 
        this.sp.visible = true;
        this.hook_X=data.hook_X;
        this.hook_Y=data.hook_Y;
        this.style = data.style;          
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
        }
        this.sp.loadImage("gameView/"+data.style+".png");
        this.sp.pos(data.hook_X,data.hook_Y);
    }

    //创建钩子精灵
    hook_CreateSprite(x,y,style){
        this.sp=new Laya.Sprite();
        this.sp.loadImage("gameView/"+style+".png");
        this.sp.pos(x,y);
        this.sp.pivot(this.sp.width/2,this.sp.height/2);
        this.sp.zOrder=1;
        this.view.addChild(this.sp);
    }

    //若是hook2,创建圈
    private hook2_createCircle() : void
    {
        this.spCircle = new Laya.Sprite();
        this.spCircle.graphics.drawCircle(24,20,150,"#a24");
        this.spCircle.alpha = 0.2;
        this.sp.addChild(this.spCircle);
    }

    //若是hookslider,创建移动范围,move[0]为0时，滑动杆水平；从左至右摆放；move[0]为90时，滑动杆竖直；从上至下摆放
    private hookslider_CreateMove(move:Array<number>):void{
        let count=Math.floor((move[1]-move[0])/24);
        for(let i=0;i<=count;i++){
            let hooksliderbg=new Laya.Sprite();
            if(i==0){
                hooksliderbg.loadImage("gameView/hookslider_root1.png");
            }else if(i==10){
                hooksliderbg.loadImage("gameView/hookslider_root2.png");
            }else{
                hooksliderbg.loadImage("gameView/hooksliderbg.png");
            }
            hooksliderbg.pivot(hooksliderbg.width/2,hooksliderbg.height/2);
            hooksliderbg.rotation=this.Rotation;
            hooksliderbg.zOrder=0.5;
            this.view.addChild(hooksliderbg);
            this.hooksliderBgArray.push(hooksliderbg);
            if(this.Rotation==0){
                hooksliderbg.pos(move[0]+i*hooksliderbg.width,this.sp.y);
            }else if(this.Rotation==90){
                hooksliderbg.pos(this.sp.x,move[0]+i*hooksliderbg.width);
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

    public hookDestroy() : void
    {
        this.sp.visible = false;
        this.isCreate = false;
        this.sp.x = 10000;
    }
}