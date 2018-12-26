export default class Monster{
    /**横坐标 */
	public x:number;
	/**纵坐标 */
    public y:number;
    /**钩子类型 */
    public style : string;
    /**精灵 */
    public sp:Laya.Sprite;
    constructor(){

    }

    init(x,y,style):void{
        this.x=x;
        this.y=y;
        this.monster_CreateSprite(x,y,style);       
    }

    update(newX,newY,newStyle):void{
        this.x=newX;
        this.y=newY;
        
    }

    monster_CreateSprite(x,y,style){
        this.sp=new Laya.Sprite();
        this.sp.loadImage("gameView/"+style+".png");
		this.sp.pivot(this.sp.width/2,this.sp.height/2);
		this.sp.pos(x,y);
    }

    hook_CreateRope():void{
        //检测与糖果得距离
    }
}