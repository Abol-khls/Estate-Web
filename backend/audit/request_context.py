import threading

_local = threading.local()


def set_current_actor(user):

    _local.value = user


def get_current_actor():

    return getattr(_local, 'value', None)


def clear_current_actor():

    _local.value = None