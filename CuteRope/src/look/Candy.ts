export default class Candy{
	/**横坐标 */
	public x:number;
	/**纵坐标 */
	public y:number;
	/**精灵 */
	public arr_candy: Array<Laya.Sprite>;
	/**刚体 */
	public arr_body:Array<Laya.RigidBody>;
	/**连接锚点 */
	public anchor:Array<number>;
    constructor(x,y,count){//count绳子的数量
		this.arr_candy = Array<Laya.Sprite>();
		this.arr_body = Array<Laya.RigidBody>();
		
		this.anchor=[30,30];
		this.x=x;
		this.y=y;
        this.createBody(x,y,count);
    }
    
    createBody(x,y,count):void{
		//获取Sprite
		for(let i=0; i<count; i++)
		{
		this.arr_candy[i]=new Laya.Sprite();
		this.arr_candy[i].loadImage("comp/candy.png");
		this.arr_candy[i].zOrder=1;
		this.arr_candy[i].pivot(this.arr_candy[i].width/2,this.arr_candy[i].height/2);
		this.arr_candy[i].pos(x,y);
		//this.candy.visible=false;
		Laya.stage.addChild(this.arr_candy[i]);
		//添加RigidBody组件,设置刚体属性
		this.arr_body[i]=new Laya.RigidBody();
		this.arr_body[i].type="dynamic";
		this.arr_body[i].allowRotation = true;
		this.arr_body[i].angularDamping = 10;
		this.arr_body[i].linearDamping = 0.01;
		this.arr_candy[i].addComponentIntance(this.arr_body[i]);
		var collider=new Laya.BoxCollider();
		collider.width=this.arr_candy[i].width;
		collider.height=this.arr_candy[i].height;
		collider.isSensor=true;
		collider.density = 50;
		this.arr_candy[i].addComponentIntance(collider);
		}
		this.toOne();
	}
	/**焊接在一起 */
	private toOne() : void
	{
		let weldJoint : Laya.WeldJoint;
		for(let i=1; i<this.arr_candy.length; i++)
		{
			weldJoint = new Laya.WeldJoint();
			weldJoint.otherBody = this.arr_body[i-1];
			weldJoint.selfBody = this.arr_body[i];
			weldJoint.anchor = [this.arr_candy[i].width/2,this.arr_candy[i].height/2];
			weldJoint.collideConnected = false;
			this.arr_candy[i].addComponentIntance(weldJoint);
		}
	}

	public getCandy(i) : Laya.Sprite
	{
		return this.arr_candy[i];
	}

	public getBody(i) : Laya.RigidBody
	{
		return this.arr_body[i];
	}

	public set(string) : void
	{
		this.arr_body.forEach(body => {
			if(string == "nog")
			{
				body.gravityScale = 0;
			}
			if(string == "useg")
			{
				body.gravityScale = 1;
			}
		});
		this.arr_candy.forEach(body => {

		});
	}
	
}