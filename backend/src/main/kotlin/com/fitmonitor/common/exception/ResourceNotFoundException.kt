package com.fitmonitor.common.exception

class ResourceNotFoundException(resource: String, id: String) :
    RuntimeException("$resource not found with id: $id")
