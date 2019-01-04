eval 
_direnv_hook() {
  local previous_exit_status=$?;
  eval "$("/usr/bin/direnv" export bash)";
  return $previous_exit_status;
};
if ! [[ "$PROMPT_COMMAND" =~ _direnv_hook ]]; then
  PROMPT_COMMAND="_direnv_hook;$PROMPT_COMMAND"
fi
