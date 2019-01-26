import Tool from "../Tool/Tool";
    export default class Star{
    /**星星类型 */
    public style : string;
    /**横坐标 */
	public star_X:number;
	/**纵坐标 */
    public star_Y:number;
    /**图片宽度 */
    public width:number;
    /**图片高度 */
    public height:number;   
    /****/ 
    public sp : Laya.Sprite;   
    /**精灵 */
    public anim:Laya.Animation;
    public anim2 : Laya.Animation;
    public anim3:Laya.Animation;
    /**是否前进 */
    public isGoing:boolean;
    private view : Laya.Panel;
    /***是否消失 */
    public isDestroy : boolean;
    constructor(view){
        this.view = view;
    }

    //初始化,"star1"为普通星星，"star2"为有时间寿命得星星
    init(data):void{
        this.isDestroy = false;     
        this.sp = new Laya.Sprite();
        this.sp.width=80;
        this.sp.height=80;
        this.star_CreateAnim(data.star_X,data.star_Y,data.style,data.interval);
        this.sp.x=data.star_X;
        this.sp.y=data.star_Y;
        this.style=data.style;
        
       /* if(data.move[0]){
            this.star_X=this.sp.x;
            this.star_Y=this.sp.y;
            this.isGoing=true;
            Laya.timer.frameLoop(1,this,this.star_MoveBySelf,[data.move]);
        }*/
    }
    //更新状态
    update(data):void{
        this.isDestroy = false;        
        this.sp.visible = true;
        this.sp.x=data.star_X;
        this.sp.y=data.star_Y;
        this.style=data.style;
        this.anim.visible = true;
        this.anim.play(0,true);
        this.anim.interval=data.interval;
        this.anim2.visible = false;
        if(data.style=="star2"){
            this.anim3.visible=true;
            this.anim3.interval=data.interval;
            this.anim3.play(0,false);
        }else{
            this.anim3.visible=false;

        }
    }
    //创建星星动画
    star_CreateAnim(x,y,style,interval){
        this.anim=new Laya.Animation();
        this.anim.loadAnimation("GameView/ani/Star.ani");
        this.anim.interval=interval;
        this.anim.play(0,true);
        this.anim.x -= this.sp.width/2;
        this.anim.y -= this.sp.height/2;
        this.anim.zOrder = 100;

        this.anim2 = new Laya.Animation();
        this.anim2.loadAnimation("GameView/ani/StarDestroy.ani");
        this.anim2.on(Laya.Event.COMPLETE,this,this.destroyed);
        this.anim2.x -= this.sp.width/2;
        this.anim2.y -= this.sp.height/2;
        this.anim2.visible = false;

        //创建时间寿命动画1
        this.anim3=new Laya.Animation();
        this.anim3.loadAnimation("GameView/ani/StarTime1.ani");
        this.anim3.visible=false;
        if(style=="star2"){
            this.anim3.play(0,false);
            this.anim3.interval=interval;
            this.anim3.on(Laya.Event.COMPLETE,this,this.destroyed);
            this.anim3.visible=true;
        }

        this.sp.addChild(this.anim);
        this.sp.addChild(this.anim2);
        this.sp.addChild(this.anim3);
        this.view.addChild(this.sp);
    }

    //星星来回移动
    private star_MoveBySelf():void{       
        console.log("成没"); 
        /*let x_Add=Tool.rotationDeal(this.star_X,this.star_Y,move[0],move[1],"cos");
        let y_Add=Tool.rotationDeal(this.star_X,this.star_Y,move[0],move[1],"sin");
        if(this.isGoing){
            this.sp.x+=x_Add;
            this.sp.y+=y_Add;
            if(x_Add==0){
                if(this.sp.y==move[1]){
                    this.isGoing=false;
                }
            }
            else if(y_Add==0){
                if(this.sp.x==move[0]){
                    this.isGoing=false;
                }
            }
            else
            {
                if(Math.abs(this.sp.x-move[0])<0.3){
                    this.sp.x=move[0];
                    this.sp.y=move[1];
                    this.isGoing=false;
                    
                }
            }
        }else{
            this.sp.x-=x_Add;
            this.sp.y-=y_Add;
            if(x_Add==0){
                if(this.sp.y==this.star_Y){
                    this.isGoing=true;
                }
            }
            else if(y_Add==0){
                if(this.sp.x==this.star_X){
                    this.isGoing=true;
                }
            }else {
                if(Math.abs(this.sp.x-this.star_X)<0.3){
                this.sp.x=this.star_X;
                this.sp.y=this.star_Y;
                this.isGoing=true;
            }
        }
    }*/
    }


    /**Star消失 */
    public starDestroy(style) : void
    {
        this.anim.stop();
        this.anim.visible = false;
        
        this.anim2.visible = true;
        this.anim2.play(0,false);
        
        if(style=="star2"){
            this.anim3.stop();
            this.anim3.visible=false;
        }
        this.isDestroy = true;
    }

    /**星星消失 */
    private destroyed(style) : void
    {
        this.sp.x = 100000;
        this.sp.visible = false;
        this.anim3.visible=false;
    }
    
     
}