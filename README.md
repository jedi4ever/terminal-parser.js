Nothing see here yet

# Usage
## ttydebug & ttydebugd

This repo contains a utility/binary to debug terminal sessions. It will show the codes/operations that the escape codes in a terminal are doing.

To start a debugging listener/daemon
`$ ttydebugd`

To start a new terminal 
`$ ttydebug`

They both communicate via /tmp/ttydebug socket. If you would like to change it, pass the new name as a param to both binaries

```
{"code":"CHAR","data":" "}
{"code":"OP","ops":[["ATTR","BOLD","ON"]]}
{"code":"OP","ops":[["ATTR","FG",6]]}
{"code":"CHAR","data":"$"}
{"code":"OP","ops":[["ATTR","RESET"]]}
{"code":"CHAR","data":" "}
{"code":"CHAR","data":"df -k"}
{"type":"special","cmd":"BACKSPACE"}
{"type":"special","cmd":"BACKSPACE"}
{"type":"special","cmd":"BACKSPACE"}
{"type":"special","cmd":"BACKSPACE"}
{"type":"special","cmd":"BACKSPACE"}
{"code":"OP","ops":[["ERASE","INLINE",0]]}
{"code":"CHAR","data":"df -k"}
{"code":"CHAR","data":"\r\n"}
{"code":"CHAR","data":"bash: __git_ps1: command not found\r\n"}
{"code":"CHAR","data":"("}
```

