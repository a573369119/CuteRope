import {ui} from "../ui/layaMaxUI";

/**
 * 
 */
export default class SelectBoxPage extends ui.SelectBox.SelectBoxUI
{
    /**季度数 */
    private quarter : number;
    constructor(){
        super();
    }

    onEnable() : void
    {
        
    }

    onOpened(index) : void
    {
        this.quarter = index;
    }



}