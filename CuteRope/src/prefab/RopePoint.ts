import GameConfig from "../config/GameConfig";
export default class RopePoint{
	/**横坐标 */
	public x:number;
	/**纵坐标 */
	public y:number;
	/**精灵 */
	public sp:Laya.Sprite;
	/**刚体 */
	public body:Laya.RigidBody;
	/**属于hook */
	public style : string;
	/**是否连接糖果 */
	public isConnectCandy : boolean;

    constructor(x,y,type:string,style,rotation?){	
			this.style = style;
			this.init({"x":x,"y":y,"type":type,"rotation":rotation}); 	
    }
    
    //初始化,创建绳子节点
    init(data):void{
        this.x=data.x;
        this.y=data.y;
				this.ropePoint_CreateSprite(data.x,data.y,data.rotation);
        this.ropePoint_AddBody(data.type);
        this.ropePoint_AddCollider();
    }

    //更新状态
    update(data):void{
        this.x=data.x;
        this.y=data.y;
        this.sp.pos(data.x,data.y);
		}
		
    //创建节点精灵
    ropePoint_CreateSprite(x,y,rotation):void{
		this.sp=new Laya.Sprite();
		this.sp.loadImage("gameView/rope1.png");
		this.sp.pivot(this.sp.width/2,this.sp.height/2);
		if(rotation)
		{
			this.sp.rotation = rotation;
		}

		this.sp.pos(x,y);
		// Laya.stage.addChild(this.sp);
    }

		/**
			* 添加到舞台
		 */
		public addView(view) : void
		{
				view.addChild(this.sp);
		}

    //添加RigidBody组件,设置刚体属性
    ropePoint_AddBody(type:string):void{  
		let ropePoint_A : number = GameConfig.ROPE_POINT_ANGULARDAMPING;
		let ropePoint_L : number = GameConfig.ROPE_POINT_LINEARDAMOING;
		if(this.style == "hook3")
		{
			ropePoint_A = GameConfig.ROPE_JUMP__POINT_ANGULARDAMPING;
			ropePoint_L = GameConfig.ROPE_JUMP__POINT_LINEARDAMOING;
		}
		this.body=new Laya.RigidBody();
		this.body.type=type;
		this.body.allowRotation = true;
		this.body.angularDamping = ropePoint_A;
		this.body.linearDamping = ropePoint_L;
		this.sp.addComponentIntance(this.body);
    }
    
    //添加Collider组件,设置碰撞体属性
    ropePoint_AddCollider():void{ 
		let density : number = GameConfig.ROPE_POINT_DENSITY;
		if(this.style == "hook3")
		{
			density = GameConfig.ROPE_JUMP__POINT_DENSITY;
		}
		let colider = new Laya.BoxCollider();
		colider.width = this.sp.width;
		colider.height = this.sp.height;
		colider.density = density;
		colider.isSensor = true;
		this.sp.addComponentIntance(colider);
    }

    //添加Joint组件,设置关节属性
    ropePoint_AddJoint(lastRopePoint:RopePoint):void{     
		if(!lastRopePoint) return;
		let joint : Laya.RevoluteJoint  = new Laya.RevoluteJoint();
		joint.otherBody = lastRopePoint.sp.getComponent(Laya.RigidBody);
		joint.anchor = [this.sp.width/2,this.sp.height/2];
		joint.collideConnected = false;
		this.sp.addComponentIntance(joint);
	}


		
}