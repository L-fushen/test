<?php
namespace Home\Controller;
use Think\Controller;
class ProjectController extends Controller {
    public function index(){
        $this->display(APP_PATH.'Home/View/project-list.html');
    }

    public function add()
    {
        $this->display(APP_PATH.'Home/View/project-act.html');
    }
}