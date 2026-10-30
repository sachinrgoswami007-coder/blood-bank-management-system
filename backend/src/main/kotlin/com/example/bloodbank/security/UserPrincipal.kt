package com.example.bloodbank.security

import com.example.bloodbank.entity.Role
import com.example.bloodbank.entity.User
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class UserPrincipal(
    val id: Long,
    val name: String,
    private val email: String,
    private val passwordHash: String,
    val role: Role,
    private val isUserEnabled: Boolean,
    private val authoritiesList: Collection<GrantedAuthority>
) : UserDetails {

    companion object {
        fun create(user: User): UserPrincipal {
            val authorities = listOf(SimpleGrantedAuthority("ROLE_${user.role.name}"))
            return UserPrincipal(
                id = user.id!!,
                name = user.name,
                email = user.email,
                passwordHash = user.password,
                role = user.role,
                isUserEnabled = user.enabled,
                authoritiesList = authorities
            )
        }
    }

    override fun getAuthorities(): Collection<GrantedAuthority> = authoritiesList
    override fun getPassword(): String = passwordHash
    override fun getUsername(): String = email
    override fun isAccountNonExpired(): Boolean = true
    override fun isAccountNonLocked(): Boolean = true
    override fun isCredentialsNonExpired(): Boolean = true
    override fun isEnabled(): Boolean = isUserEnabled
}
