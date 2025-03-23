export const enum ChatRole {
    Developer = 'developer',
    System = 'system',
    User = 'user',
    Assistant = 'assistant',
    Tool = 'tool',
    Function = 'function'
  }

  export  type ChatRoleOpenAPi = 'developer' | 'system' | 'user' | 'assistant' | 'tool' | 'function'