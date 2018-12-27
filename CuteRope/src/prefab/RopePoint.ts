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

    constructor(x,y,type:string){	
			this.init({"x":x,"y":y,"type":type}); 	
    }
    
    //初始化,创建绳子节点
    init(data):void{
        this.x=data.x;
        this.y=data.y;
        this.ropePoint_CreateSprite(data.x,data.y);
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
    ropePoint_CreateSprite(x,y):void{
		this.sp=new Laya.Sprite();
		this.sp.loadImage("gameView/rope1.png");
		this.sp.pivot(this.sp.width/2,this.sp.height/2);
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
		this.body=new Laya.RigidBody();
		this.body.type=type;
		this.body.allowRotation = true;
		this.body.angularDamping = GameConfig.ROPE_POINT_ANGULARDAMPING;
		this.body.linearDamping = GameConfig.ROPE_POINT_LINEARDAMOING;
		this.sp.addComponentIntance(this.body);
    }
    
    //添加Collider组件,设置碰撞体属性
    ropePoint_AddCollider():void{ 
		let colider = new Laya.BoxCollider();
		colider.width = this.sp.width;
		colider.height = this.sp.height;
		colider.density = GameConfig.ROPE_POINT_DENSITY;
		colider.isSensor = true;
		this.sp.addComponentIntance(colider);
    }

    //添加Joint组件,设置关节属性
    ropePoint_AddJoint(lastRopePoint:RopePoint):void{     
		if(!lastRopePoint) return;
		let joint : Laya.RevoluteJoint  = new Laya.RevoluteJoint();
		joint.otherBody = lastRopePoint.sp.getComponent(Laya.RigidBody);
		joint.anchor = [this.sp.width/2,this.sp.height/2];
		this.sp.addComponentIntance(joint);
	}
		
}