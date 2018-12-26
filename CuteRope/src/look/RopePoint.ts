export default class RopePoint{
	/**横坐标 */
	public x:number;
	/**纵坐标 */
	public y:number;
	/**精灵 */
	public rp:Laya.Sprite;
	/**刚体 */
	public body:Laya.RigidBody;
	/**连接锚点 */
	public anchor:Array<number>;

    constructor(x,y,type:string,lastRopePoint){		
		this.anchor=[4,6];
		this.createBody(x,y,type,lastRopePoint);
		this.x=x;
		this.y=y;
    }
    
    createBody(x,y,type:string,lastRopePoint:RopePoint):void{
        //获取Sprite
		this.rp=new Laya.Sprite();
		this.rp.loadImage("comp/rope.png");
		this.rp.pivot(this.rp.width/2,this.rp.height/2);
		this.rp.pos(x,y);
		Laya.stage.addChild(this.rp);
		
        //添加RigidBody组件,设置刚体属性
		this.body=new Laya.RigidBody();
		this.body.type=type;
		this.body.allowRotation = true;
		this.body.angularDamping = 80;
		this.body.linearDamping = 0.04;
		this.body.gravityScale = 1;
		this.rp.addComponentIntance(this.body);

		//colider
		let colider = new Laya.BoxCollider();
		colider.width = this.rp.width;
		colider.density = 1000;
		colider.height = this.rp.height;
		colider.isSensor = true;
		this.rp.addComponentIntance(colider);
		/*var collider=new Laya.BoxCollider();
		this.body.group = -1;nc
		collider.width=this.rp.width;
		collider.height=this.rp.height;
		collider.isSensor=true;
		this.rp.addComponentIntance(collider);*/
		/**创建joint */
		if(!lastRopePoint) return;
		let joint : Laya.RevoluteJoint  = new Laya.RevoluteJoint();
		joint.otherBody = lastRopePoint.rp.getComponent(Laya.RigidBody);
		joint.anchor = [this.rp.width/2,this.rp.height/2];

		this.rp.addComponentIntance(joint);

	}
		
}