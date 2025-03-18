export enum ReasonStatusCode {
    // 2xx: Success
    ACCEPTED = "Accepted",
    CREATED = "Created",
    NO_CONTENT = "No Content",
    NON_AUTHORITATIVE_INFORMATION = "Non Authoritative Information",
    OK = "OK",
    PARTIAL_CONTENT = "Partial Content",

    // 3xx: Redirection
    MOVED_PERMANENTLY = "Moved Permanently",
    MOVED_TEMPORARILY = "Moved Temporarily",
    PERMANENT_REDIRECT = "Permanent Redirect",
    TEMPORARY_REDIRECT = "Temporary Redirect",
    SEE_OTHER = "See Other",
    
    // 4xx: Client Error
    BAD_REQUEST = "Bad Request",
    UNAUTHORIZED = "Unauthorized",
    FORBIDDEN = "Forbidden",
    NOT_FOUND = "Not Found",
    METHOD_NOT_ALLOWED = "Method Not Allowed",
    NOT_ACCEPTABLE = "Not Acceptable",
    REQUEST_TIMEOUT = "Request Timeout",
    CONFLICT = "Conflict",
    LENGTH_REQUIRED = "Length Required",
    PRECONDITION_FAILED = "Precondition Failed",
    REQUEST_TOO_LONG = "Request Entity Too Large",
    REQUEST_URI_TOO_LONG = "Request-URI Too Long",
    TOO_MANY_REQUESTS = "Too Many Requests",
    UNPROCESSABLE_ENTITY = "Unprocessable Entity",
    UNSUPPORTED_MEDIA_TYPE = "Unsupported Media Type",
    REQUESTED_RANGE_NOT_SATISFIABLE = "Requested Range Not Satisfiable",
    PRECONDITION_REQUIRED = "Precondition Required",
    NETWORK_AUTHENTICATION_REQUIRED = "Network Authentication Required",
    UNAVAILABLE_FOR_LEGAL_REASONS = "Unavailable For Legal Reasons",
    
    // 5xx: Server Error
    INTERNAL_SERVER_ERROR = "Internal Server Error",
    NOT_IMPLEMENTED = "Not Implemented",
    BAD_GATEWAY = "Bad Gateway",
    SERVICE_UNAVAILABLE = "Service Unavailable",
    GATEWAY_TIMEOUT = "Gateway Timeout",
    HTTP_VERSION_NOT_SUPPORTED = "HTTP Version Not Supported",
    INSUFFICIENT_STORAGE = "Insufficient Storage",
    INSUFFICIENT_SPACE_ON_RESOURCE = "Insufficient Space on Resource",
    METHOD_FAILURE = "Method Failure",
    LOCKED = "Locked",
    PROCESSING = "Processing",
    FAILED_DEPENDENCY = "Failed Dependency",
    EXPECTATION_FAILED = "Expectation Failed",

    // 418: I'm a Teapot (RFC 2324)
    IM_A_TEAPOT = "I'm a teapot",

    // 507: Insufficient Storage (RFC 2518)
    MULTI_STATUS = "Multi-Status",

    // 510: Not Extended (RFC 2774)
    MISDIRECTED_REQUEST = "Misdirected Request",

    // Deprecated or obsolete codes
    USE_PROXY = "Use Proxy",
}
