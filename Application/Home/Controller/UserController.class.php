<?php
namespace Home\Controller;
use Think\Controller;
class UserController extends Controller {
    public function index(){
        $this->display(APP_PATH.'Home/View/user-list.html');
    }
}