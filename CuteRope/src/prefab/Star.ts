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
    /**精灵 */
    public anim:Laya.Animation;
    constructor(){
        this.width=35;
        this.height=35;
    }

    //初始化,"star1"为普通星星，"star2"为有时间寿命得星星
    init(data):void{
        if(data.style=="star1"){
            this.star_CreateAnim(data.star_X,data.star_Y);
        }else if(data.style=="star2"){
            /*this.star_CreateAnim(star_X,star_Y);
            this.star_CreateDestroyAnim(star_X,star_Y);*/
        }
        this.star_X=data.star_X;
        this.star_Y=data.star_Y;
        this.style=data.style;
    }
    //更新状态
    update(data):void{
        this.star_X=data.star_X;
        this.star_Y=data.star_Y;
        if(data.style=="star1"){
            this.anim.pos(data.star_X,data.star_Y);
        }else if(data.style=="star2"){
            /*this.anim.pos(star_X,star_Y);
            this.star_CreateDestroyAnim(star_X,star_Y);*/
        }
        this.star_X=data.star_X;
        this.star_Y=data.star_Y;
        this.style=data.style;
    }
    //创建星星动画
    star_CreateAnim(x,y){
        this.anim=new Laya.Animation();
        this.anim.loadAnimation("starRotate.ani");
        this.anim.play(0,true);
		this.anim.pos(x,y);
    }

    //创建时间寿命动画
    star_CreateDestroyAnim(x,y):void{

    }
}