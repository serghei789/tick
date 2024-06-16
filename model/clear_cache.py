import functools
import gc

def clear_cache():
    gc.collect()
    wrappers = [
        a for a in gc.get_objects()
        if isinstance(a, functools._lru_cache_wrapper)]
    for wrapper in wrappers:
        wrapper.cache_clear()