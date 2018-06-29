from rest_framework import permissions


class WordPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        if request.method not in permissions.SAFE_METHODS:
            return False
        return True
