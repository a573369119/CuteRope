import {ui} from "../ui/layaMaxUI";

/**
 * shopdilog
 */
export default class ShopDialog extends ui.Shop.ShopDialogUI{

    constructor(){
        super();
        this.init();
    }
    
    private init() : void
    {
        this.btn_close.on(Laya.Event.CLICK,this,this.onClose);
        this.btn_shop1.on(Laya.Event.CLICK,this,this.showShop,[1]);
        this.btn_shop2.on(Laya.Event.CLICK,this,this.showShop,[2]);
        // this.film.on(Laya.Event.CLICK)
    }

    private onClose() : void
    {
        this.close();
    }

    private showShop(index) : void
    {
        let shopTopSkin = "shop/shop1Top.png";
        let shopskinMian = "shop/shop1Main.png";
        let shopContent = true;
        if(index==2)
        {
            shopContent = false;
            shopTopSkin = "shop/shop2Top.png";
            shopskinMian = "shop/shop2main.png";
        }
        this.shop1.visible = shopContent;
        this.shop2.visible = !shopContent;
        this.shopskinTop.skin = shopTopSkin;
        this.shopskinMain.skin = shopskinMian;
    }

    public set(lookShop,gameView?) : void
    {
        if(gameView)
        {
            //检查道具
            if(true)
            {
                return;
            }
        }
        this.showShop(lookShop);
        this.popup();
    }
}