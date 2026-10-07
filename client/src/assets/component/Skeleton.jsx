import MatrixBg from './MatrixBg.jsx';
import './Skeleton.css';

function Bone({ w, h = 9, className = '' }) {
    return <span className={`sk-bone ${className}`} style={{ width: w, height: h }} />;
}

export function LoginSkeleton({ variant = 'signin' }) {
    const isSignup = variant === 'signup';

    return (
        <div className="sk-root sk-login" aria-busy="true" aria-label="Loading">
            <MatrixBg seed={3} />

            <aside className="sk-login-side">
                <Bone w={144} />
                <div className="sk-col sk-gap-8 sk-mt-24">
                    <Bone w={240} h={68} />
                    <Bone w={112} h={68} />
                    <Bone w={288} h={68} />
                </div>
                <div className="sk-col sk-gap-8 sk-mt-28">
                    <Bone w="100%" />
                    <Bone w="80%" />
                </div>
                <div className="sk-col sk-gap-16 sk-mt-32">
                    {[180, 210, 196, 220].map((w) => (
                        <div key={w} className="sk-row sk-gap-12">
                            <Bone w={20} h={20} />
                            <Bone w={w} />
                        </div>
                    ))}
                </div>
                <div className="sk-login-stats">
                    <Bone w="100%" h={64} />
                    <Bone w="100%" h={64} />
                    <Bone w="100%" h={64} />
                </div>
            </aside>

            <main className="sk-login-main">
                <div className="sk-form">
                    <div className="sk-row sk-gap-32 sk-tabs">
                        <Bone w={isSignup ? 96 : 80} h={isSignup ? 26 : 9} />
                        <Bone w={isSignup ? 96 : 80} h={isSignup ? 26 : 9} />
                    </div>

                    <Bone w={128} className="sk-mt-24" />
                    <Bone w={isSignup ? 160 : 112} h={32} className="sk-mt-12" />
                    {!isSignup && <Bone w={288} className="sk-mt-16" />}

                    {(isSignup ? [80, 48, 64, 128] : [56, 80]).map((label, i) => (
                        <div key={i} className="sk-col sk-gap-8 sk-mt-24">
                            <Bone w={label} />
                            <Bone w="100%" h={isSignup ? 44 : 48} />
                            {isSignup && i === 0 && <Bone w={192} className="sk-mt-4" />}
                        </div>
                    ))}

                    {!isSignup && (
                        <div className="sk-row sk-between sk-mt-24">
                            <Bone w={144} />
                            <Bone w={112} />
                        </div>
                    )}

                    <Bone w="100%" h={isSignup ? 52 : 56} className="sk-mt-24" />
                    {isSignup ? (
                        <Bone w={252} className="sk-mt-16 sk-center" />
                    ) : (
                        <Bone w="100%" h={44} className="sk-mt-16" />
                    )}

                    <span className="sk-rule sk-mt-24" />

                    {!isSignup && (
                        <div className="sk-grid-3 sk-mt-24">
                            <Bone w="100%" h={64} />
                            <Bone w="100%" h={64} />
                            <Bone w="100%" h={64} />
                        </div>
                    )}
                    <Bone w={isSignup ? 152 : 191} className="sk-mt-24 sk-center" />
                </div>
            </main>
        </div>
    );
}

function CardBones() {
    return (
        <div className="sk-card">
            <Bone w={32} h={14} />
            <Bone w="90%" className="sk-mt-16" />
            <Bone w="60%" className="sk-mt-8" />
            <Bone w={48} className="sk-mt-24" />
        </div>
    );
}

export function SelectModeSkeleton({ onLaunch }) {
    const launch = onLaunch
        ? {
              role: 'button',
              tabIndex: 0,
              onClick: onLaunch,
              onKeyDown: (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onLaunch();
                  }
              },
          }
        : {};

    return (
        <div
            className={`sk-root sk-select ${onLaunch ? 'is-launchable' : ''}`}
            aria-busy={!onLaunch}
            aria-label={onLaunch ? 'Click anywhere to launch' : 'Loading'}
            {...launch}
        >
            <MatrixBg seed={9} />

            <div className="sk-select-inner">
                <Bone w={128} />
                <div className="sk-row sk-between sk-end sk-mt-12">
                    <Bone w={288} h={56} />
                    <div className="sk-row sk-gap-8">
                        <Bone w={96} h={56} />
                        <Bone w={96} h={56} />
                    </div>
                </div>

                {[0, 1].map((group) => (
                    <div key={group} className="sk-mt-40">
                        <div className="sk-row sk-gap-12 sk-center-y">
                            <Bone w={group ? 80 : 64} />
                            <span className="sk-rule sk-flex" />
                            <Bone w={group ? 96 : 64} />
                        </div>
                        <div className="sk-grid-3 sk-mt-16">
                            <CardBones />
                            <CardBones />
                            <CardBones />
                        </div>
                    </div>
                ))}

                <span className="sk-rule sk-mt-40" />
                <div className="sk-row sk-gap-32 sk-mt-12">
                    <Bone w={80} />
                    <Bone w={64} />
                    <Bone w={80} />
                </div>

                {onLaunch && <p className="sk-launch">[ CLICK ANYWHERE TO LAUNCH ]</p>}
            </div>
        </div>
    );
}
