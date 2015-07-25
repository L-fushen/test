<?php
namespace Home\Controller;
use Think\Controller;
class ListController extends Controller {
    public function index(){
        $this->display(APP_PATH.'Home/View/list.html');
    }
}