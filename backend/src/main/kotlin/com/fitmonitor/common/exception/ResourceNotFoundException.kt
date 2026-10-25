package com.fitmonitor.common.exception

class ResourceNotFoundException(message: String) : RuntimeException(message) {
    constructor(resource: String, id: String) : this("$resource not found with id: $id")
}
