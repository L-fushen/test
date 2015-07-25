<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends Controller {
    public function index(){
        $this->display(APP_PATH.'Home/View/index.html');
    }
}