"""Route typed recipes while preserving the existing Soma generator's immutable version."""
from soma_parameter_schema import F
from soma_generation_service import generate as soma_generate, check_activation as soma_version
from native_generation_service import generate as native_generate, check_activation as native_version, supports

def version_for(tid):
    if tid in F:return soma_version()
    if supports(tid):return native_version()
    raise RuntimeError('이 유형의 저장 문항은 현재 생성 규칙과 연결되지 않았습니다.')

def generate(tid,parameters):
    if isinstance(tid,str)and tid in F:return soma_generate(tid,parameters)
    return native_generate(tid,parameters)
