/**
 * 玩家数据
 */
export class PlayerData{
    /**玩家 获得星星的总数量 0*/
    public starNum : number ; 

    /**玩家超能力数量 */
    public super : number;
    /**玩家引导数量 */
    public teach : number;

    /**季度限制数 - 配置加载 从0开始*/
    public arr_LimitSelect : Array<number>;


    constructor(){
        //测试数据
        this.init();
    }
    public static ins : PlayerData = new PlayerData();

    /**初始化 */
    private init() : void
    {
        this.arr_LimitSelect = new Array<number>();
    }

    /**是否能解开该关卡？ @select : 关卡数 0 1 2*/
    public isSelect(select : number) : boolean
    {
        let SelectNum : number;
        return this.starNum >= this.arr_LimitSelect[select]?true:false;
    }

    /**解析对应季度的星星数 */
    public parseSelect_Star() : void
    {
        
    }    

    /**解析获得关卡的星星数 */
    public parseRound_Star() : void
    {

    }
}