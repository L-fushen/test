<?php if (!defined('THINK_PATH')) exit();?><div class="am-cf am-padding-bottom-0">
    <div class="am-fl am-cf">
        <ol class="am-breadcrumb am-breadcrumb-slash">
            <li><a href="#">首页</a></li>
            <li class="am-active">需求列表</li>
        </ol>
    </div>
    <div class="am-fr">
        <a href="javascript:;" onclick="load_page('<?php echo U('Project/add');?>')" class="am-btn am-btn-secondary am-btn-xs">
            <i class="am-icon-send"></i>
            发布需求
        </a>
    </div>
</div>
<div class="page-bg">
    <table class="am-table">
        <thead>
            <tr>
                <th style="width:50px;">ID</th>
                <th style="width:auto;">项目</th>
                <th style="width:80px;">类型</th>
                <th style="width:80px;">金额</th>
                <th style="width:105px;">交付时间</th>
                <th style="width:150px;">创建时间</th>
                <th style="width:100px;">接单人员</th>
                <th style="width:100px;">状态</th>
                <th style="width:120px;">操作</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>Amaze UI</td>
                <td>整站</td>
                <td>100</td>
                <td>2012-10-01</td>
                <td>2015-06-07 12:08</td>
                <td>李天翔</td>
                <td>进行中</td>
                <td>
                    <a href="#" style="margin-right:10px;color:#3BB4F2"><span class="am-icon-pencil-square-o"></span> 编辑</a>
                    <a href="#" style="color:#D7342E"><span class="am-icon-trash-o"></span> 删除</a>
                </td>
            </tr>
            <tr>
                <td>2</td>
                <td>Amaze UI</td>
                <td>整站</td>
                <td>100</td>
                <td>2012-10-01</td>
                <td>2015-06-07 12:08</td>
                <td>李天翔</td>
                <td>进行中</td>
                <td>
                    <a href="#" style="margin-right:10px;color:#3BB4F2"><span class="am-icon-pencil-square-o"></span> 编辑</a>
                    <a href="#" style="color:#D7342E"><span class="am-icon-trash-o"></span> 删除</a>
                </td>
            </tr>
        </tbody>
    </table>
</div>