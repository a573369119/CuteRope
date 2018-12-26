export default class Candy{
    /**横坐标 */
	public candy_X:number;
	/**纵坐标 */
    public candy_Y:number;
    /**糖果类型 */
    public style : string;
	/**精灵 */
	public sp:Laya.Sprite;
	/**刚体 */
	public body:Laya.RigidBody;
	/**关节数组 */
    public candy_JointArray:Array<Laya.RevoluteJoint>;
    
    constructor(){
        this.candy_JointArray=new Array<Laya.RevoluteJoint>();
    }

    //初始化,糖果仅有图片的更换
    init(data):void{
        this.candy_X=data.candy_X;
        this.candy_Y=data.candy_Y;
        this.style;
        this.candy_CreateSprite(data.candy_X,data.candy_Y,data.style);
        this.candy_AddBody();
    }
    
    //更新状态
    update(data):void{
        this.candy_X=data.candy_X;
        this.candy_Y=data.candy_Y;
        this.style=data.style;
        this.sp.pos(data.candy_X,data.candy_Y);
        this.sp.loadImage("gameView/"+data.style+".png");
    }

    //创建糖果精灵
    candy_CreateSprite(x,y,style):void{
        this.sp=new Laya.Sprite();
        this.sp.loadImage("gameView/"+style+".png");
		this.sp.zOrder=1;
		this.sp.pos(x,y);
    }

    //添加RigidBody组件,设置刚体属性
    candy_AddBody():void{       
		this.body=new Laya.RigidBody();
		this.body.type="dynamic";
		this.body.allowRotation = true;
		this.body.angularDamping = 8;
		this.body.linearDamping = 0.03;
		this.sp.addComponentIntance(this.body);
    }
    //添加Joint组件,设置关节属性
    candy_AddJoint(body):void{
        let joint = new Laya.RevoluteJoint();
		    joint.otherBody = body;
		    joint.anchor = [this.sp.width/2,this.sp.height/2];
        this.sp.addComponentIntance(joint);
        this.candy_JointArray.push(joint);
    }
}