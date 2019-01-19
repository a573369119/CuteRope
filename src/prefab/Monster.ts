import GameConfig from "../config/GameConfig";
export default class Monster{
    /**横坐标 */
	public x:number;
	/**纵坐标 */
    public y:number;
    /**精灵 */
    public sp:Laya.Sprite;
    /**添加层 */
    public view : Laya.Panel;
    /**当前动作 */
    public ani : Laya.Animation;
    public aniStr : string;

    constructor(monsterConfig,view){
        this.ani = new Laya.Animation();
        this.view = view;
        this.init(monsterConfig);
        this.monsterAction(GameConfig.ANI_MONSTER_STAND,true);
        this.ani.on(Laya.Event.COMPLETE,this,this.aniChange);
        this.sp.addChild(this.ani);
    }

    /**动画状态转化 */
    private aniChange() : void
    {
        if(this.aniStr == GameConfig.ANI_MONSTER_HAPPYE)
        {
            this.monsterAction(GameConfig.ANI_MONSTER_STAND,true);
        }
    }

    init(monsterConfig):void{
        this.x=monsterConfig.monster_X;
        this.y=monsterConfig.monster_Y;
        this.monster_CreateSprite(this.x,this.y);       
    }

    update(monsterConfig):void{
        this.x=monsterConfig.monster_X;
        this.y=monsterConfig.monster_Y;
        this.sp.x = this.x;
        this.sp.y = this.y;
        this.monsterAction(GameConfig.ANI_MONSTER_STAND,true);
    }

    monster_CreateSprite(x,y){
        this.sp=new Laya.Sprite();
        this.sp.width = 85;
        this.sp.height = 85;
        this.sp.pivot(this.sp.width/2,this.sp.height/2);
        this.sp.pos(x,y);
        this.view.addChild(this.sp);
    }

    /***
     * 怪物行为
     * 
     */
    public monsterAction(aName:string,isLoop?:boolean) : void
    {
        if(!isLoop) isLoop=false;
        this.aniStr = aName;
        this.ani.loadImages(this.aniUrls(aName,this.getAniLength(aName)));
        this.ani.play(0,isLoop);
    } 
    /**
     * 创建一组动画的url数组（美术资源地址数组）
     * @param aniName  动作的名称，用于生成url
     * @param length   动画最后一帧的索引值，
     */
    private aniUrls(aniName:string, length:number) : Array<any>
    {
        var urls: Array<any> = [];
        for (var i=1; i <= length; i++) 
        {
            //动画资源路径要和动画图集打包前的资源命名对应起来
            urls.push("gameView/monster/" + aniName + i + ".png");
        }
        return urls;
    }

    private getAniLength(aName) : number
    {
        switch(aName)
        {
            case GameConfig.ANI_MONSTER_STAND: return 17;
            case GameConfig.ANI_MONSTER_SAD: return 15;
            case GameConfig.ANI_MONSTER_EAT: return 9;
            case GameConfig.ANI_MONSTER_HAPPYE:return 19;
            case GameConfig.ANI_MONSTER_OPEN: return 10;
            case GameConfig.ANI_MONSTER_GIVE_ME: return 26;
            case GameConfig.ANI_MONSTER_ACTION: return 43;
            case GameConfig.ANI_MONSTER_GIVE_ME2: return 20;
        }
    }

    // public clearTimer() : void
    // {
    //     Laya.timer.clear(this,this.);
    // }
}