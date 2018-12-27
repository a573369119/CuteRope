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
    private view : Laya.Panel;
    /***是否消失 */
    public isDestroy : boolean;
    constructor(data,view){
        this.view = view;
        this.sp = new Laya.Sprite();
        this.sp.width=80;
        this.sp.height=80;
        this.init(data);
    }

    //初始化,"star1"为普通星星，"star2"为有时间寿命得星星
    init(data):void{
        this.isDestroy = false;        
        if(data.style=="star1"){
            this.star_CreateAnim(data.star_X,data.star_Y);
        }else if(data.style=="star2"){
            /*this.star_CreateAnim(star_X,star_Y);
            this.star_CreateDestroyAnim(star_X,star_Y);*/
        }
        this.sp.x=data.star_X;
        this.sp.y=data.star_Y;
        this.style=data.style;
    }
    //更新状态
    update(data):void{
        this.isDestroy = false;        
        // this.star_X=data.star_X;
        // this.star_Y=data.star_Y;
        if(data.style=="star1"){
            // this.anim.pos(data.star_X,data.star_Y);
        }else if(data.style=="star2"){
            /*this.anim.pos(star_X,star_Y);
            this.star_CreateDestroyAnim(star_X,star_Y);*/
        }
        this.sp.visible = true;
        this.sp.x=data.star_X;
        this.sp.y=data.star_Y;
        this.style=data.style;
        this.anim.visible = true;
        this.anim.play(0,true);
        this.anim2.visible = false;
    }
    //创建星星动画
    star_CreateAnim(x,y){
        this.anim=new Laya.Animation();
        this.anim.loadAnimation("GameView/ani/Star.ani");
        this.anim.play(0,true);
        // this.anim.pos(x,y);
        this.anim.x -= this.sp.width/2;
        this.anim.y -= this.sp.height/2;
        
        this.anim2 = new Laya.Animation();
        this.anim2.loadAnimation("GameView/ani/StarDestroy.ani");
        this.anim2.on(Laya.Event.COMPLETE,this,this.destroyed);
        this.anim2.x -= this.sp.width/2;
        this.anim2.y -= this.sp.height/2;
        this.anim2.visible = false;

        this.sp.addChild(this.anim);
        this.sp.addChild(this.anim2);
        this.view.addChild(this.sp);
    }

    /**Star消失 */
    public starDestroy() : void
    {
        this.anim.stop();
        this.anim.visible = false;

        this.anim2.visible = true;
        this.anim2.play(0,false);
        // this.anim2.pos(this.sp.x,this.sp.y);
        this.isDestroy = true;
    }

    /**星星消失 */
    private destroyed() : void
    {
        this.sp.x = 100000;
        this.sp.visible = false;
    }
    //创建时间寿命动画
    star_CreateDestroyAnim(x,y):void{

    }

     
}