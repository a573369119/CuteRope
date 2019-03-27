/**
 * 游戏配置 属性设置
 * */
export default class GameConfig{
    /////////////////////////////////绳子
    /**绳子生成像素间隔 */
    public static ROPE_DIC : number = 4;
    /**绳子节点转动阻力 */
    public static ROPE_POINT_ANGULARDAMPING : number = 100000;
    /**绳子线性阻力 */
    public static ROPE_POINT_LINEARDAMOING : number = 0.001;
    /**绳子密度 */
    public static ROPE_POINT_DENSITY : number = 1;
    /**绳子自动靠近糖果速度 */
    public static ROPE_TO_CANDY_SPEED : number = 20;
    /**绳子粗细 */
    public static ROPE_WIDTH : number = 7;
    ////////////////////////////////弹力绳子
    /**绳子生成像素间隔*/
    public static ROPE_JUMP_DIC : number = 1;
    /**绳子节点转动阻力 */
    public static ROPE_JUMP__POINT_ANGULARDAMPING : number = 80;
    /**绳子线性阻力 */
    public static ROPE_JUMP__POINT_LINEARDAMOING : number = 0.001;
    /**绳子密度 */
    public static ROPE_JUMP__POINT_DENSITY : number = 2;
    /**绳子自动靠近糖果速度 */
    public static ROPE_JUMP__TO_CANDY_SPEED : number = 30;
    ///////////////////////////////糖果
    /**糖果转动阻力 */
    public static CANDY_ANGULARDAMPING : number = 0;
    /**糖果线性转动阻力 */
    public static CANDY_LINEARDAMPING : number = 0;
    /**糖果密度 */
    public static CANDY_DENSITY : number = 200;
    /**糖果重力洗漱 */
    public static CANDY_GRAVITY : number = 1.5;
    /////////////////////////////////怪物
    /**吃糖果距离 */
    public static MONSTER_EAT_DIC : number = 60;
    /**张大嘴距离 */
    public static MONSTER_OPEN_MOUSE : number = 200;
    //////////////////////////////////////
    /**[monster]糖果丢失， 伤心 15*/
    public static ANI_MONSTER_SAD : string = "no"; 
    /**[monster]糖果吃到，咀嚼 9 LOOP*/
    public static ANI_MONSTER_EAT : string = "eat";
    /**[monster]吃到星星，开心 19*/
    public static ANI_MONSTER_HAPPYE : string = "getStar";
    /**[monster]糖果靠近 张嘴 13*/
    public static ANI_MONSTER_OPEN : string = "open";
    /**[monster]动作 给我吃 26*/
    public static ANI_MONSTER_GIVE_ME : string = "giveMe";
    /**[monster]动作 随机 29*/
    public static ANI_MONSTER_GIVE_ME2 : string = "giveMe2_";
    /**[monster]站立 不动 17*/
    public static ANI_MONSTER_STAND : string = "stand";
    /**[monster]动作 翘脚 43*/
    public static ANI_MONSTER_ACTION : string = "ation";
    ////////////////////////////超能力
    public static SUPER_V : number = 7;
    //////////////////////////////////////////////蜘蛛动画
    /**【蜘蛛】 糖果接近 */
    public static ANI_FOUND_CANDY : string = "spiderfond";
    /** 【蜘蛛】爬向糖果 */
    public static ANI_TOWORD_CANDY : string = "spider";
    /** 【蜘蛛】得到糖果 */
    public static ANI_GET_CANDY : string = "spiderget" ;
    //////////////////////////////////////////////蜘蛛
    /**蜘蛛的移动速度 */
    public static SPIDER_SPEED = 0.03;
    /**蜘蛛下掉速度 */
    public static SPIDER_SPEEDX = 0.0008;
    /////////////////////////////////////////////世界
    /***重力系数 世界 */
    public static WOLDE_G = 14;
    /////////////////////////////////////////////层级配置
    /**hook顶部 */
    public static ZORDER_HOOK_TOP = 3;
    /**ropePoint */
    public static ZORDER_ROPEPOINT = 2;
    /**糖果 */
    public static ZORDER_CANDY = 50;
    /**气泡 */
    public static ZORDER_BALLON = 51;
    /////////////////////////////////////////////////坐标差记录
    public static CaX = 0;
    public static CaY = 0;
}
