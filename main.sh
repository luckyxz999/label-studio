#!/bin/bash
#
#
#

# PS:需要修改的地方
SERVER_NAME="微表情标注平台"



# PS:固定的地方================================================================================================

# 接收指令
act=$1


# 切换到脚本所属目录
cd `dirname $0`

# 项目目录
DEPLOY_DIR=/usr/local/deploy/label-studio


#==============================================================================================
# 获取已启动的进程ID
EXIST_PID=`ps -Ao pid,cmd | grep $DEPLOY_DIR | grep -v grep | awk '{print $1}'`


if [ "$act" = "" ];
then
    echo -e "\033[0;31m 未输入操作名 \033[0m  \033[0;34m {start|stop|restart|status} \033[0m"
    exit 1
fi

function stop() {
  if [ -z "$EXIST_PID" ]; then
      echo "服务【$SERVER_NAME】还没有启动"
      exit 1
  fi

  LISTEN_INFO=`netstat -natp | grep $EXIST_PID | grep -i LISTEN | grep -v grep`

  echo -n "开始关闭服务【$SERVER_NAME】"
  for PID in $EXIST_PID ; do
    while [ true ]; do
      kill -9 $PID > /dev/null 2>&1
	  sleep 1
	  EXIST_PID=`ps -f -p $PID | grep python`
	  LISTEN_INFO=`netstat -natp | grep $PID | grep -i LISTEN`
	  if ([ -n "$EXIST_PID" ] || [ -n "$LISTEN_INFO" ]); then
	     echo -n "."
	  else
	     break;
	  fi
    done
  done

  echo -e "\n关闭服务【$SERVER_NAME】完成"
}

function start() {
  if [ -n "$EXIST_PID" ]; then
      echo "服务【$SERVER_NAME】已经启动"
      exit 1
  elif [ -n "$LISTEN_INFO" ]; then
      echo "服务【$SERVER_NAME】未关闭完成，不能启动，请检查网络监听信息 >>> $LISTEN_INFO"
	  exit 1
  fi

  echo "开始启动服务【$SERVER_NAME】....."

  exec nohup poetry run python $DEPLOY_DIR/label_studio/manage.py runserver 0.0.0.0:8080  > /dev/null 2>&1 &

  EXIST_PID=`ps -Ao pid,cmd | grep $DEPLOY_DIR | grep -v grep | awk '{print $1}'`

  echo "服务【$SERVER_NAME】启动成功！"

  echo "服务名称: $SERVER_NAME"
  echo "PID: $EXIST_PID"
}

function restart() {
    stop
    sleep 2
    start
}

function status() {
  PID=`ps -ef |grep $DEPLOY_DIR|grep -v grep|wc -l`
  echo $PID
  # PID=`ps -Ao pid,cmd | grep $DEPLOY_DIR | grep -v grep | awk '{print $1}'`
  if [ $PID != 0 ];then
      echo "服务【$SERVER_NAME】正在运行..."
  else
      echo "服务【$SERVER_NAME】未运行"
  fi
}

case $1 in
    start)
    start;;
    stop)
    stop;;
    restart)
    restart;;
    status)
    status;;
    *)

esac


