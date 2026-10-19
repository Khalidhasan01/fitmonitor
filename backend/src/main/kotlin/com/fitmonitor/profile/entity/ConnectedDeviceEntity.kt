package com.fitmonitor.profile.entity

import jakarta.persistence.*
import org.hibernate.annotations.UuidGenerator
import java.time.LocalDateTime

@Entity
@Table(name = "connected_devices")
class ConnectedDeviceEntity(
    @Id @UuidGenerator
    var id: String = "",

    @Column(nullable = false)
    var name: String = "",

    @Column(nullable = false)
    var type: String = "watch",

    var connected: Boolean = false,
    var lastSynced: LocalDateTime? = null,
    var syncFrequency: String = "realtime"
)
