export default class Hook{
	/**横坐标 */
	public x:number;
	/**纵坐标 */
	public y:number;
	/**精灵 */
	private hk:Laya.Sprite;

    constructor(x,y){
		
		this.createBody(x,y);
		this.x=x;
		this.y=y;
    }
    
    createBody(x,y):void{
        //获取Sprite
		this.hk=new Laya.Sprite();
		this.hk.loadImage("comp/hook.png");
		this.hk.pivot(this.hk.width/2,this.hk.height/2);
		this.hk.pos(x,y);
        Laya.stage.addChild(this.hk);
	}
		
}